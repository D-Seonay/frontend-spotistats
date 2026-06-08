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
import { ParsedStats, SpotifyStreamingData } from "@/lib/types"
import { ActivityHeatmap } from "@/components/ActivityHeatmap"
import { StatCardWidget } from "@/components/StatCardWidget"
import { TopArtistsWidget } from "@/components/TopArtistsWidget"
import { TopTracksWidget } from "@/components/TopTracksWidget"

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
                  <TopArtistsWidget topArtists={displayStats.topArtists} />
                </div>

                {/* Top Tracks (2x3) */}
                <div className="md:col-span-2 md:row-span-3">
                  <TopTracksWidget topTracks={displayStats.topTracks} />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
