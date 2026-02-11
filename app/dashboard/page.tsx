"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, TrendingUp, Clock, Heart, LogOut, User, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CsvImporter } from "@/components/CsvImporter"
import SpotifyPlayer from "@/components/SpotifyPlayer"
import { analyzeData } from "@/components/CsvImporter"
import { Input } from "@/components/ui/input"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
} from "lucide-react"
import { useMemo } from "react"

// Define ParsedStats interface as per CsvImporter.tsx
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

interface SpotifyStreamingData {
  endTime: string
  artistName: string
  trackName: string
  msPlayed: number
}

interface Filters {
  artistSearch: string
  trackSearch: string
  dateFrom: string
  dateTo: string
  minPlaytime: number
}

// Activity Heatmap Component (GitHub-style)
function ActivityHeatmap({ data }: { data: { date: string; minutes: number; streams: number }[] }) {
  const weeks = useMemo(() => {
    if (data.length === 0) return []

    const dataMap = new Map(data.map((d) => [d.date, d]))
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 364)

    const allDays: { date: string; minutes: number; streams: number; weekday: number }[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0]
      const existing = dataMap.get(dateStr)
      allDays.push({
        date: dateStr,
        minutes: existing?.minutes || 0,
        streams: existing?.streams || 0,
        weekday: current.getDay(),
      })
      current.setDate(current.getDate() + 1)
    }

    const weeksArray: (typeof allDays)[] = []
    let currentWeek: typeof allDays = []

    allDays.forEach((day, index) => {
      if (index === 0) {
        for (let i = 0; i < day.weekday; i++) {
          currentWeek.push({ date: "", minutes: 0, streams: 0, weekday: i })
        }
      }
      currentWeek.push(day)
      if (day.weekday === 6 || index === allDays.length - 1) {
        weeksArray.push(currentWeek)
        currentWeek = []
      }
    })

    return weeksArray
  }, [data])

  const maxMinutes = useMemo(() => Math.max(...data.map((d) => d.minutes), 1), [data])

  const getIntensity = (minutes: number) => {
    if (minutes === 0) return "bg-white/5"
    const ratio = minutes / maxMinutes
    if (ratio < 0.25) return "bg-[#1DB954]/30"
    if (ratio < 0.5) return "bg-[#1DB954]/50"
    if (ratio < 0.75) return "bg-[#1DB954]/70"
    return "bg-[#1DB954]"
  }

  const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  if (weeks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Aucune donnée disponible pour la heatmap
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 pr-2 text-xs text-gray-500">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-3 leading-3">
              {i % 2 === 1 ? day : ""}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`group relative h-3 w-3 rounded-sm transition-all hover:ring-1 hover:ring-white/50 ${
                    day.date ? getIntensity(day.minutes) : "bg-transparent"
                  }`}
                >
                  {day.date && day.minutes > 0 && (
                    <div className="pointer-events-none absolute -top-12 left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs group-hover:block">
                      <p className="font-medium">{day.date}</p>
                      <p className="text-gray-400">
                        {day.minutes} min · {day.streams} écoutes
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Moins</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-white/5" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/30" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/50" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/70" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]" />
        </div>
        <span>Plus</span>
      </div>
    </div>
  )
}

// Chart colors
const CHART_COLORS = ["#1DB954", "#1ed760", "#169c46", "#0d7a35", "#095c28"]

import { useData } from "@/lib/DataContext"

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "import">("overview")
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const { allRawData, importedStats, setImportedData } = useData()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    artistSearch: "",
    trackSearch: "",
    dateFrom: "",
    dateTo: "",
    minPlaytime: 0,
  })
  const [activeChart, setActiveChart] = useState<"area" | "bar" | "pie">("area")

  const handleDataImported = (stats: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedData(stats, rawData)
    setActiveTab("overview") // Switch to overview after import
  }

  const handleLogout = () => {
    router.push("/")
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
      if (filters.trackSearch && !item.trackName.toLowerCase().includes(filters.trackSearch.toLowerCase())) {
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
    if (filteredData.length === 0) return null
    return analyzeData(filteredData)
  }, [filteredData])

  const displayStats = filteredStats || importedStats

  const stats = {
    totalListeningTime: displayStats ? Math.round(displayStats.totalMinutes / 60).toLocaleString() : "0",
    topGenre: "N/A", // Genre not directly available in current ParsedStats
    totalTracks: displayStats ? displayStats.uniqueTracks.toLocaleString() : "0",
    totalArtists: displayStats ? displayStats.uniqueArtists.toLocaleString() : "0",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="font-mono text-lg font-bold text-black">SLS</span>
            </div>
            <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#1DB954]">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-300 hover:text-[#1DB954]">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            Bienvenue sur ton{" "}
            <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400">Découvre tes statistiques d'écoute Spotify</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Clock className="h-4 w-4" />
                Temps d'écoute (h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1DB954]">{stats.totalListeningTime}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Heart className="h-4 w-4" />
                Genre préféré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1DB954]">{stats.topGenre}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Music className="h-4 w-4" />
                Total Titres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1DB954]">{stats.totalTracks}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <TrendingUp className="h-4 w-4" />
                Total Artistes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#1DB954]">{stats.totalArtists}</p>
            </CardContent>
          </Card>
        </div>

        {/* Spotify Player */}
        <div className="mb-8">
          <SpotifyPlayer onReady={setDeviceId} />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-white/10">
          <Link
            href="/all-music"
            className="whitespace-nowrap px-4 py-2 transition-colors text-gray-400 hover:text-white"
          >
            Tous les Titres
          </Link>
          <Link
            href="/all-artists"
            className="whitespace-nowrap px-4 py-2 transition-colors text-gray-400 hover:text-white"
          >
            Tous les Artistes
          </Link>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 transition-colors ${
              activeTab === "import" ? "border-b-2 border-[#1DB954] text-[#1DB954]" : "text-gray-400 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            Importer CSV
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "import" ? (
          <CsvImporter onDataImported={handleDataImported} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {activeTab === "overview" && (
              <>
                {!importedStats ? (
                  <p>Importez vos données Spotify (fichiers CSV/JSON) pour voir vos statistiques.</p>
                ) : (
                  <>
                  {/* Filters */}
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm lg:col-span-2">
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

                  {/* Charts Section */}
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm lg:col-span-2">
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="flex items-center gap-2 text-white">
                          <BarChart3 className="h-5 w-5 text-[#1DB954]" />
                          Visualisations
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant={activeChart === "area" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveChart("area")}
                            className={activeChart === "area" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                          >
                            Tendance
                          </Button>
                          <Button
                            variant={activeChart === "bar" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveChart("bar")}
                            className={activeChart === "bar" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                          >
                            Par heure
                          </Button>
                          <Button
                            variant={activeChart === "pie" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveChart("pie")}
                            className={activeChart === "pie" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                          >
                            Par jour
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        {activeChart === "area" && displayStats.monthlyData.length > 0 && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayStats.monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                                labelStyle={{ color: "#fff" }}
                              />
                              <Area
                                type="monotone"
                                dataKey="minutes"
                                stroke="#1DB954"
                                fill="url(#colorGradient)"
                                name="Minutes"
                              />
                              <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                            </AreaChart>
                          </ResponsiveContainer>
                        )}

                        {activeChart === "bar" && displayStats.hourlyData.length > 0 && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayStats.hourlyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                                labelStyle={{ color: "#fff" }}
                              />
                              <Bar dataKey="streams" fill="#1DB954" name="Écoutes" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}

                        {activeChart === "pie" && displayStats.weekdayData.length > 0 && (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={displayStats.weekdayData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="streams"
                                nameKey="day"
                              >
                                {displayStats.weekdayData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Heatmap */}
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Calendar className="h-5 w-5 text-[#1DB954]" />
                        Activité d'écoute (12 derniers mois)
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Visualisation de votre activité quotidienne style GitHub
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ActivityHeatmap data={displayStats.dailyData} />
                    </CardContent>
                  </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-[#1DB954]" />
                          Top 5 Titres
                        </CardTitle>
                        <Link href="/all-music">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#1DB954]">
                            Voir tout
                          </Button>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {displayStats.topTracks.length > 0 ? (
                            displayStats.topTracks.slice(0, 5).map((track, index) => (
                              <div key={track.name + track.artist + index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="font-medium">{track.name}</p>
                                    <p className="text-sm text-gray-400">
                                      {track.artist}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-400">
                                  {track.plays} écoutes
                                </span>{" "}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400">Aucun titre trouvé.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#1DB954]" />
                          Top 5 Artistes
                        </CardTitle>
                        <CardDescription className="text-gray-400">Tes artistes préférés</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {displayStats.topArtists.length > 0 ? (
                            displayStats.topArtists.slice(0, 5).map((artist, index) => (
                              <div key={artist.name + index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                                    {index + 1}
                                  </span>
                                  <p className="font-medium">{artist.name}</p>
                                </div>
                                <span className="text-sm text-gray-400">
                                  {artist.plays} écoutes
                                </span>{" "}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400">Aucun artiste trouvé.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
