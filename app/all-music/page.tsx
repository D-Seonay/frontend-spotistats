"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Music } from "lucide-react"
import PageLayout from "@/components/PageLayout"

interface Track {
  name: string
  artists: { name: string }[]
  album: {
    images: { url: string }[]
  }
}

export default function AllMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch("/api/spotify/tracks")
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        setTracks(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">
          Toutes tes{" "}
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            Musiques
          </span>
        </h1>
        <p className="mb-8 text-gray-400">Découvre l'ensemble de tes titres préférés de tous les temps.</p>

        {loading && <p>Chargement des titres...</p>}
        {error && <p className="text-red-500">Erreur: {error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tracks.map((track, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/20 text-lg font-bold text-[#1DB954]">
                    {index + 1}
                  </span>
                  {track.album?.images?.[0]?.url && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">{track.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
