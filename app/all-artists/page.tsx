"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, Filter, ChevronDown, ChevronUp, Calendar, User, Music, Clock } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import { CsvImporter, analyzeData } from "@/components/CsvImporter"
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

interface Filters {
  artistSearch: string
  trackSearch: string
  dateFrom: string
  dateTo: string
  minPlaytime: number
}

export default function AllArtistsPage() {
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    artistSearch: "",
    trackSearch: "",
    dateFrom: "",
    dateTo: "",
    minPlaytime: 0,
  })

  const handleDataImported = (data: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedStats(data)
    setAllRawData(rawData)
  }

  const resetFilters = () => {
    setFilters({
      artistSearch: "",
      trackSearch: "",
      dateFrom: "",
      dateTo: "",
      minPlaytime: 0,
    })
  }

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (allRawData.length === 0) return []

    return allRawData.filter((item) => {
      if (filters.artistSearch && !item.artistName.toLowerCase().includes(filters.artistSearch.toLowerCase())) {
        return false
      }
      if (filters.trackSearch && !item.trackName.toLowerCase().includes(filters.trackName.toLowerCase())) {
        return false
      }
      if (filters.dateFrom && item.endTime) {
        const itemDate = new Date(item.endTime)
        const fromDate = new Date(filters.dateFrom)
        if (itemDate < fromDate) return false
      }
      if (filters.dateTo && item.endTime) {
        const itemDate = new Date(item.endTime)
        const toDate = new Date(filters.dateTo)
        if (itemDate > toDate) return false
      }
      if (filters.minPlaytime > 0 && item.msPlayed / 60000 < filters.minPlaytime) {
        return false
      }
      return true
    })
  }, [allRawData, filters])

  // Recalculate stats based on filtered data
  const filteredStats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalStreams: 0,
        totalMinutes: 0,
        uniqueTracks: 0,
        uniqueArtists: 0,
        topTracks: [],
        topArtists: [],
        monthlyData: [],
        hourlyData: [],
        weekdayData: [],
        dailyData: [],
      };
    }
    return analyzeData(filteredData)
  }, [filteredData])

  const allUniqueArtists = useMemo(() => {
    if (!importedStats || filteredData.length === 0) return []
    // Get unique artists from filteredData, not just topArtists
    const uniqueArtistsMap = new Map<string, { name: string }>();
    filteredData.forEach(item => {
        if (!uniqueArtistsMap.has(item.artistName)) {
            uniqueArtistsMap.set(item.artistName, { name: item.artistName });
        }
    });
    return Array.from(uniqueArtistsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [importedStats, filteredData])

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
            {/* Filters */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <CardHeader className="cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-[#1DB954]" />
                    Filtres avancés
                    {(filters.artistSearch || filters.trackSearch || filters.dateFrom || filters.dateTo || filters.minPlaytime > 0) && (
                      <span className="rounded-full bg-[#1DB954]/20 px-2 py-1 text-xs text-[#1DB954]">Actifs</span>
                    )}
                  </div>
                  {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
              {showFilters && (
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        <User className="mr-1 inline h-4 w-4" />
                        Artiste
                      </label>
                      <Input
                        placeholder="Rechercher un artiste..."
                        value={filters.artistSearch}
                        onChange={(e) => setFilters({ ...filters, artistSearch: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        <Music className="mr-1 inline h-4 w-4" />
                        Titre
                      </label>
                      <Input
                        placeholder="Rechercher un titre..."
                        value={filters.trackSearch}
                        onChange={(e) => setFilters({ ...filters, trackSearch: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        <Clock className="mr-1 inline h-4 w-4" />
                        Durée minimum (min)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPlaytime || ""}
                        onChange={(e) => setFilters({ ...filters, minPlaytime: Number.parseInt(e.target.value) || 0 })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        Date de début
                      </label>
                      <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="w-full border-white/10 text-white bg-transparent"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                  {(filters.artistSearch || filters.trackSearch || filters.dateFrom || filters.dateTo || filters.minPlaytime > 0) && (
                    <p className="mt-4 text-sm text-gray-400">
                      {filteredData.length} écoutes correspondent aux filtres (sur {allRawData.length} total)
                    </p>
                  )}
                </CardContent>
              )}
            </Card>

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
