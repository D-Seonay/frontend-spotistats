"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ParsedStats, SpotifyStreamingData } from "@/lib/types"

interface Metadata {
  images: Record<string, string> // key could be artistName or trackName
}

interface DataContextProps {
  allRawData: SpotifyStreamingData[]
  importedStats: ParsedStats | null
  setImportedData: (stats: ParsedStats, rawData: SpotifyStreamingData[]) => void
  metadata: Metadata
  updateMetadata: (newMetadata: Partial<Metadata>) => void
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)
  const [metadata, setMetadata] = useState<Metadata>({ images: {} })

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
    <DataContext.Provider value={{ allRawData, importedStats, setImportedData, metadata, updateMetadata }}>
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
