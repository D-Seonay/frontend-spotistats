"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, Filter, ChevronDown, ChevronUp, Calendar, User, Music, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import { CsvImporter, analyzeData } from "@/components/CsvImporter"
import { Input } from "@/components/ui/input"

import { useData } from "@/lib/DataContext"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSpotifyArtistImage } from "@/lib/hooks/useSpotifyArtistImage"

// Define SpotifyStreamingData and Filters interfaces from DataContext
import { SpotifyStreamingData, ParsedStats, Filters } from "@/lib/DataContext"

function ArtistCard({ artist, index, currentPage, itemsPerPage }: {
  artist: { name: string; plays: number };
  index: number;
  currentPage: number;
  itemsPerPage: number;
}) {
  const imageUrl = useSpotifyArtistImage(artist.name)

  return (
    <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/20 text-lg font-bold text-[#1DB954]">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`${artist.name} image`} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
            <TrendingUp className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-medium">{artist.name}</CardTitle>
          <CardDescription className="text-gray-400">
            {artist.plays} écoutes
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export default function AllArtistsPage() {
  const { allRawData, importedStats, setImportedData } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    artistSearch: "",
    trackSearch: "",
    dateFrom: "",
    dateTo: "",
    minPlaytime: 0,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const handleDataImported = (data: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedData(data, rawData)
  }

  const resetFilters = () => {
    setFilters({
      artistSearch: "",
      trackSearch: "",
      dateFrom: "",
      dateTo: "",
      minPlaytime: 0,
    })
    setCurrentPage(1) // Reset page on filter change
  }

  // Filter data based on current filters
  const dataAfterFilters = useMemo(() => {
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
    if (dataAfterFilters.length === 0) {
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
    return analyzeData(dataAfterFilters)
  }, [dataAfterFilters])

  const allUniqueArtists = useMemo(() => {
    if (!importedStats || dataAfterFilters.length === 0) return []
    const uniqueArtistsPlayCountMap = new Map<string, { name: string; plays: number }>()
    dataAfterFilters.forEach(item => {
      const existing = uniqueArtistsPlayCountMap.get(item.artistName)
      if (existing) {
        existing.plays++
      } else {
        uniqueArtistsPlayCountMap.set(item.artistName, { name: item.artistName, plays: 1 })
      }
    })
    return Array.from(uniqueArtistsPlayCountMap.values()).sort((a, b) => b.plays - a.plays) // Sort by plays descending
  }, [importedStats, dataAfterFilters])

  // Apply search term filtering
  const searchedArtists = useMemo(() => {
    if (!searchTerm) {
      return allUniqueArtists
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allUniqueArtists.filter(artist =>
      artist.name.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }, [allUniqueArtists, searchTerm])

  // Apply pagination
  const totalPages = Math.ceil(searchedArtists.length / itemsPerPage)
  const paginatedArtists = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return searchedArtists.slice(startIndex, endIndex)
  }, [searchedArtists, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

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
                      {dataAfterFilters.length} écoutes correspondent aux filtres (sur {allRawData.length} total)
                    </p>
                  )}
                </CardContent>
              )}
            </Card>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <Input
                type="text"
                placeholder="Rechercher un artiste..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset page on search
                className="border-white/10 bg-white/5 text-white md:w-1/3"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Éléments par page:</span>
                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[100px] border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="25" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {paginatedArtists.length === 0 && (
              <p className="text-gray-400">Aucun artiste ne correspond à votre recherche ou aucune donnée importée.</p>
            )}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedArtists.map((artist, index) => (
                <ArtistCard
                  key={artist.name} // Use a more stable key
                  artist={artist}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-white/10 text-white bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
                <span className="text-gray-400">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-white/10 text-white bg-transparent"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </PageLayout>
  )
}

