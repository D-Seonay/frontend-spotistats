"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Music } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import { CsvImporter } from "@/components/CsvImporter"
import { Input } from "@/components/ui/input"

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

export default function AllMusicPage() {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDataImported = (data: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedStats(data)
    setAllRawData(rawData)
  }

  const allUniqueTracks = useMemo(() => {
    const uniqueTracksMap = new Map<string, { name: string; artist: string }>()
    allRawData.forEach(item => {
      const key = `${item.trackName}-${item.artistName}`
      if (!uniqueTracksMap.has(key)) {
        uniqueTracksMap.set(key, { name: item.trackName, artist: item.artistName })
      }
    })
    return Array.from(uniqueTracksMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [allRawData])

  const filteredTracks = useMemo(() => {
    if (!searchTerm) {
      return allUniqueTracks
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allUniqueTracks.filter(track =>
      track.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      track.artist.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }, [allUniqueTracks, searchTerm])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">
          Toutes tes{" "}
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            Musiques
          </span>
        </h1>
        <p className="mb-8 text-gray-400">
          Importe tes données Spotify pour découvrir l'ensemble de tes titres préférés de tous les temps.
        </p>

        {!importedStats && (
          <div className="mb-8">
            <CsvImporter onDataImported={(stats, rawData) => handleDataImported(stats, rawData)} />
          </div>
        )}

        {importedStats && (
          <>
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Rechercher un titre ou un artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            {filteredTracks.length === 0 && (
              <p className="text-gray-400">Aucun titre ne correspond à votre recherche ou aucune donnée importée.</p>
            )}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTracks.map((track, index) => (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/20 text-lg font-bold text-[#1DB954]">
                      {index + 1}
                    </span>
                    {/* Placeholder for album image as it's not directly available in SpotifyStreamingData */}
                    <div className="h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                      <Music className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium">{track.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {track.artist}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
