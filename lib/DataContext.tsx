"use client"

import { createContext, useContext, useState, ReactNode, useMemo } from "react"
import { ParsedStats, SpotifyStreamingData, SpotifyNowPlaying } from "@/lib/types"

interface Metadata {
  images: Record<string, string> // key could be artistName or trackName
}

interface DataContextProps {
  allRawData: SpotifyStreamingData[]
  apiData: SpotifyStreamingData[]
  mergedData: SpotifyStreamingData[]
  setApiData: (data: SpotifyStreamingData[]) => void
  nowPlaying: SpotifyNowPlaying | null
  setNowPlaying: (nowPlaying: SpotifyNowPlaying | null) => void
  importedStats: ParsedStats | null
  setImportedData: (stats: ParsedStats, rawData: SpotifyStreamingData[]) => void
  metadata: Metadata
  updateMetadata: (newMetadata: Partial<Metadata>) => void
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [apiData, setApiData] = useState<SpotifyStreamingData[]>([])
  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying | null>(null)
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)
  const [metadata, setMetadata] = useState<Metadata>({ images: {} })

  const mergedData = useMemo(() => {
    const combined = [...allRawData, ...apiData]
    const unique = combined.reduce((acc: Record<string, SpotifyStreamingData>, item) => {
      // Use endTime as unique key. Normalize if needed.
      const key = `${item.endTime}_${item.artistName}_${item.trackName}`
      if (!acc[key]) {
        acc[key] = item
      }
      return acc
    }, {})

    return Object.values(unique).sort((a, b) => 
      new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    )
  }, [allRawData, apiData])

  const setImportedData = (stats: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedStats(stats)
    setAllRawData(rawData)
  }

  const updateMetadata = (newMetadata: Partial<Metadata>) => {
    setMetadata(prev => ({
      ...prev,
      ...newMetadata,
      images: { ...prev.images, ...(newMetadata.images || {}) }
    }))
  }

  return (
    <DataContext.Provider value={{ 
      allRawData, 
      apiData,
      mergedData,
      setApiData,
      nowPlaying,
      setNowPlaying,
      importedStats, 
      setImportedData, 
      metadata, 
      updateMetadata 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
