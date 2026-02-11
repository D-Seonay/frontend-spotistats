"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, TrendingUp, Clock, Heart, LogOut, User, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CsvImporter } from "@/components/CsvImporter"
import SpotifyPlayer from "@/components/SpotifyPlayer"

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

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "import">("overview")
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [importedStats, setImportedStats] = useState<ParsedStats | null>(null)

  const handleDataImported = (data: ParsedStats) => {
    setImportedStats(data)
    setActiveTab("overview") // Switch to overview after import
  }

  const handleLogout = () => {
    router.push("/")
  }

  const stats = {
    totalListeningTime: importedStats ? Math.round(importedStats.totalMinutes / 60).toLocaleString() : "0",
    topGenre: "N/A", // Genre not directly available in current ParsedStats
    totalTracks: importedStats ? importedStats.uniqueTracks.toLocaleString() : "0",
    totalArtists: importedStats ? importedStats.uniqueArtists.toLocaleString() : "0",
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
                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-[#1DB954]" />
                          Top 5 Titres
                        </CardTitle>
                        <CardDescription className="text-gray-400">Tes titres les plus écoutés</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {importedStats.topTracks.length > 0 ? (
                            importedStats.topTracks.slice(0, 5).map((track, index) => (
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
                          {importedStats.topArtists.length > 0 ? (
                            importedStats.topArtists.slice(0, 5).map((artist, index) => (
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
