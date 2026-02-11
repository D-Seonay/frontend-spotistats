"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Files,
} from "lucide-react"

interface SpotifyStreamingData {
  endTime: string
  artistName: string
  trackName: string
  msPlayed: number
}

interface ParsedStats {
  totalStreams: number
  totalMinutes: number
  uniqueTracks: number
  uniqueArtists: number
  topTracks: { name: string; artist: string; plays: number; minutes: number }[]
  topArtists: { name: string; plays: number; minutes: number }[]
  monthlyData: { month: string; minutes: number; streams: number }[]
  hourlyData: { hour: string; streams: number }[]
  weekdayData: { day: string; streams: number }[]
  dailyData: { date: string; minutes: number; streams: number }[]
}

interface FileInfo {
  file: File
  name: string
  size: number
  status: "pending" | "processing" | "success" | "error"
  error?: string
  recordCount?: number
}

export function analyzeData(data: SpotifyStreamingData[]): ParsedStats {
  const totalMinutes = Math.round(data.reduce((sum, item) => sum + item.msPlayed, 0) / 60000)
  const uniqueTracks = new Set(data.map((item) => `${item.trackName}-${item.artistName}`)).size
  const uniqueArtists = new Set(data.map((item) => item.artistName)).size

  const trackMap = new Map<string, { name: string; artist: string; plays: number; ms: number }>()
  data.forEach((item) => {
    const key = `${item.trackName}-${item.artistName}`
    const existing = trackMap.get(key)
    if (existing) {
      existing.plays++
      existing.ms += item.msPlayed
    } else {
      trackMap.set(key, { name: item.trackName, artist: item.artistName, plays: 1, ms: item.msPlayed })
    }
  })
  const topTracks = Array.from(trackMap.values())
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)
    .map((t) => ({ ...t, minutes: Math.round(t.ms / 60000) }))

  const artistMap = new Map<string, { plays: number; ms: number }>()
  data.forEach((item) => {
    const existing = artistMap.get(item.artistName)
    if (existing) {
      existing.plays++
      existing.ms += item.msPlayed
    } else {
      artistMap.set(item.artistName, { plays: 1, ms: item.msPlayed })
    }
  })
  const topArtists = Array.from(artistMap.entries())
    .sort((a, b) => b[1].plays - a[1].plays)
    .slice(0, 10)
    .map(([name, data]) => ({ name, plays: data.plays, minutes: Math.round(data.ms / 60000) }))

  const monthMap = new Map<string, { minutes: number; streams: number }>()
  data.forEach((item) => {
    if (item.endTime) {
      const date = new Date(item.endTime)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const existing = monthMap.get(monthKey)
      if (existing) {
        existing.minutes += item.msPlayed / 60000
        existing.streams++
      } else {
        monthMap.set(monthKey, { minutes: item.msPlayed / 60000, streams: 1 })
      }
    }
  })
  const monthlyData = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, d]) => ({ month, minutes: Math.round(d.minutes), streams: d.streams }))

  const hourMap = new Map<number, number>()
  data.forEach((item) => {
    if (item.endTime) {
      const hour = new Date(item.endTime).getHours()
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
    }
  })
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    streams: hourMap.get(i) || 0,
  }))

  const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const weekdayMap = new Map<number, number>()
  data.forEach((item) => {
    if (item.endTime) {
      const day = new Date(item.endTime).getDay()
      weekdayMap.set(day, (weekdayMap.get(day) || 0) + 1)
    }
  })
  const weekdayData = weekdays.map((day, i) => ({
    day,
    streams: weekdayMap.get(i) || 0,
  }))

  const dailyMap = new Map<string, { minutes: number; streams: number }>()
  data.forEach((item) => {
    if (item.endTime) {
      const dateKey = item.endTime.split("T")[0] || item.endTime.split(" ")[0]
      const existing = dailyMap.get(dateKey)
      if (existing) {
        existing.minutes += item.msPlayed / 60000
        existing.streams++
      } else {
        dailyMap.set(dateKey, { minutes: item.msPlayed / 60000, streams: 1 })
      }
    }
  })
  const dailyData = Array.from(dailyMap.entries())
    .map(([date, d]) => ({ date, minutes: Math.round(d.minutes), streams: d.streams }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalStreams: data.length,
    totalMinutes,
    uniqueTracks,
    uniqueArtists,
    topTracks,
    topArtists,
    monthlyData,
    hourlyData,
    weekdayData,
    dailyData,
  }
}

export function CsvImporter({ onDataImported }: { onDataImported?: (stats: ParsedStats, rawData: SpotifyStreamingData[]) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): SpotifyStreamingData[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    return lines
      .slice(1)
      .map((line) => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
        const cleanValues = values.map((v) => v.replace(/"/g, "").trim())
        const obj: Record<string, string> = {}
        headers.forEach((header, index) => {
          obj[header] = cleanValues[index] || ""
        })
        return {
          endTime: obj["endTime"] || obj["ts"] || "",
          artistName: obj["artistName"] || obj["master_metadata_album_artist_name"] || "",
          trackName: obj["trackName"] || obj["master_metadata_track_name"] || "",
          msPlayed: Number.parseInt(obj["msPlayed"] || obj["ms_played"] || "0", 10),
        }
      })
      .filter((item) => item.artistName && item.trackName && item.msPlayed > 0)
  }

  const parseJSON = (text: string): SpotifyStreamingData[] => {
    try {
      const data = JSON.parse(text)
      const items = Array.isArray(data) ? data : []
      return items
        .map((item: Record<string, unknown>) => ({
          endTime: String(item.endTime || item.ts || ""),
          artistName: String(item.artistName || item.master_metadata_album_artist_name || ""),
          trackName: String(item.trackName || item.master_metadata_track_name || ""),
          msPlayed: Number(item.msPlayed || item.ms_played || 0),
        }))
        .filter((item) => item.artistName && item.trackName && item.msPlayed > 0)
    } catch {
      return []
    }
  }

  const processSingleFile = async (file: File): Promise<SpotifyStreamingData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        let data: SpotifyStreamingData[] = []
        if (file.name.endsWith(".json")) {
          data = parseJSON(text)
        } else if (file.name.endsWith(".csv")) {
          data = parseCSV(text)
        } else {
          data = parseJSON(text)
          if (data.length === 0) {
            data = parseCSV(text)
          }
        }
        if (data.length === 0) {
          reject(new Error("Format non reconnu ou fichier vide"))
        } else {
          resolve(data)
        }
      }
      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"))
      reader.readAsText(file)
    })
  }

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(
      (file) => file.name.endsWith(".json") || file.name.endsWith(".csv") || file.type === "application/json",
    )
    if (validFiles.length === 0) {
      setError("Veuillez sélectionner des fichiers JSON ou CSV valides")
      return
    }
    const fileInfos: FileInfo[] = validFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      status: "pending",
    }))
    setFiles((prev) => [...prev, ...fileInfos])
    setError(null)
  }, [])

  const processAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending")
    if (pendingFiles.length === 0) return
    setIsProcessing(true)
    setError(null)
    const combinedData: SpotifyStreamingData[] = []
    const updatedFiles = [...files]
    for (let i = 0; i < files.length; i++) {
      const fileInfo = files[i]
      if (fileInfo.status !== "pending") continue
      updatedFiles[i] = { ...fileInfo, status: "processing" }
      setFiles([...updatedFiles])
      try {
        const data = await processSingleFile(fileInfo.file)
        if (data.length === 0) {
          updatedFiles[i] = {
            ...fileInfo,
            status: "error",
            error: "Aucune donnée valide trouvée",
          }
        } else {
          combinedData.push(...data)
          updatedFiles[i] = {
            ...fileInfo,
            status: "success",
            recordCount: data.length,
          }
        }
      } catch (err) {
        updatedFiles[i] = {
          ...fileInfo,
          status: "error",
          error: err instanceof Error ? err.message : "Erreur de traitement",
        }
      }
      setFiles([...updatedFiles])
    }
    const allData = [...combinedData]
    if (allData.length > 0) {
      const stats = analyzeData(allData)
      onDataImported?.(stats, allData)
    }
    setIsProcessing(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="h-5 w-5 text-[#1DB954]" />
          Importer vos données Spotify
        </CardTitle>
        <CardDescription className="text-gray-400">
          Glissez-déposez ou sélectionnez plusieurs fichiers JSON/CSV de votre historique Spotify
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-[#1DB954] bg-[#1DB954]/10"
              : "border-white/20 hover:border-[#1DB954]/50 hover:bg-white/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-[#1DB954]/20 p-4">
              <Files className="h-8 w-8 text-[#1DB954]" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                {isDragging ? "Déposez vos fichiers ici" : "Glissez vos fichiers ou cliquez pour sélectionner"}
              </p>
              <p className="mt-1 text-sm text-gray-400">Sélection multiple supportée · Formats acceptés: JSON, CSV</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Fichiers sélectionnés ({files.length})</h4>
            </div>

            <div className="max-h-48 space-y-2 overflow-y-auto">
              {files.map((fileInfo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#1DB954]" />
                    <div>
                      <p className="text-sm font-medium text-white">{fileInfo.name}</p>
                      <p className="text-xs text-gray-400">
                        {(fileInfo.size / 1024).toFixed(1)} KB
                        {fileInfo.recordCount && ` · ${fileInfo.recordCount} entrées`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs`}>
                      {fileInfo.status}
                    </span>
                    {fileInfo.status === "pending" && (
                      <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-400">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {files.filter((f) => f.status === "pending").length > 0 && (
              <Button
                onClick={processAllFiles}
                disabled={isProcessing}
                className="w-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer {files.filter((f) => f.status === "pending").length} fichier{files.filter((f) => f.status === "pending").length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
