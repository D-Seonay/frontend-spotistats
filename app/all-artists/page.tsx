"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
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

export default function AllArtistsPage() {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDataImported = (data: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedStats(data)
    setAllRawData(rawData)
  }

  const allUniqueArtists = useMemo(() => {
    if (!importedStats) return []
    // Get unique artists from allRawData, not just topArtists
    const uniqueArtistsMap = new Map<string, { name: string }>();
    allRawData.forEach(item => {
        if (!uniqueArtistsMap.has(item.artistName)) {
            uniqueArtistsMap.set(item.artistName, { name: item.artistName });
        }
    });
    return Array.from(uniqueArtistsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allRawData, importedStats])

  const filteredArtists = useMemo(() => {
    if (!searchTerm) {
      return allUniqueArtists
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allUniqueArtists.filter(artist =>
      artist.name.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }, [allUniqueArtists, searchTerm])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">
          Tous tes{" "}
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            Artistes
          </span>
        </h1>
        <p className="mb-8 text-gray-400">
          Importe tes données Spotify pour découvrir l'ensemble de tes artistes préférés de tous les temps.
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
                placeholder="Rechercher un artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            {filteredArtists.length === 0 && (
              <p className="text-gray-400">Aucun artiste ne correspond à votre recherche ou aucune donnée importée.</p>
            )}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((artist, index) => (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/20 text-lg font-bold text-[#1DB954]">
                      {index + 1}
                    </span>
                    {/* Placeholder for artist image as it's not directly available from CsvImporter stats */}
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium">{artist.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {/* Genre not available in current ParsedStats */}
                        Genre inconnu
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
