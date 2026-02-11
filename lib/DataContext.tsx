"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

interface DataContextProps {
  allRawData: SpotifyStreamingData[]
  importedStats: ParsedStats | null
  setImportedData: (stats: ParsedStats, rawData: SpotifyStreamingData[]) => void
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)

  const setImportedData = (stats: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedStats(stats)
    setAllRawData(rawData)
  }

  return (
    <DataContext.Provider value={{ allRawData, importedStats, setImportedData }}>
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
