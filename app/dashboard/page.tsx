"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, TrendingUp, Clock, Heart, LogOut, User, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CsvImporter } from "@/components/CsvImporter"
import SpotifyPlayer from "@/components/SpotifyPlayer"
import { Calendar } from "lucide-react"
import { useMemo } from "react"
import { useData } from "@/lib/DataContext"

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

// Activity Heatmap Component (GitHub-style)
function ActivityHeatmap({ data }: { data: { date: string; minutes: number; streams: number }[] }) {
  const weeks = useMemo(() => {
    if (!data || data.length === 0) return []

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

  const maxMinutes = useMemo(() => {
    if (!data || data.length === 0) return 1
    return Math.max(...data.map((d) => d.minutes), 1)
  }, [data])

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

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "import">("overview")
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const { importedStats, setImportedData } = useData()

  const handleDataImported = (stats: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedData(stats, rawData)
    setActiveTab("overview") // Switch to overview after import
  }

  const handleLogout = () => {
    router.push("/")
  }

  const displayStats = importedStats

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

        {/* Tab Navigation */}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-6 lg:gap-6">
            {!importedStats ? (
              <div className="col-span-full">
                <p>Importez vos données Spotify (fichiers CSV/JSON) pour voir vos statistiques.</p>
              </div>
            ) : (
              <>
                {/* Stat Flash Cards (1x1 each) */}
                <div className="md:col-span-1 md:row-span-1">
                  <Card className="h-full border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
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
                </div>

                <div className="md:col-span-1 md:row-span-1">
                  <Card className="h-full border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
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
                </div>

                <div className="md:col-span-1 md:row-span-1">
                  <Card className="h-full border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
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
                </div>

                <div className="md:col-span-1 md:row-span-1">
                  <Card className="h-full border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
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

                {/* Heatmap (3x2) */}
                <div className="md:col-span-3 md:row-span-2">
                  <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
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
                </div>

                {/* Spotify Player (1x2) */}
                <div className="md:col-span-1 md:row-span-2">
                  <div className="h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center p-4">
                    <SpotifyPlayer onReady={setDeviceId} />
                  </div>
                </div>

                {/* Top Artists (2x3) */}
                <div className="md:col-span-2 md:row-span-3">
                  <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#1DB954]" />
                          Top 5 Artistes
                        </CardTitle>
                        <CardDescription className="text-gray-400">Tes artistes préférés</CardDescription>
                      </div>
                      <Link href="/all-artists">
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#1DB954]">
                          Voir tout
                        </Button>
                      </Link>
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
                </div>

                {/* Top Tracks (2x3) */}
                <div className="md:col-span-2 md:row-span-3">
                  <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-[#1DB954]" />
                          Top 5 Titres
                        </CardTitle>
                      </div>
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
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
