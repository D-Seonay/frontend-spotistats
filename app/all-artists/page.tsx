"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import PageLayout from "@/components/PageLayout"

interface Artist {
  name: string
  images: { url: string }[]
  genres: string[]
}

export default function AllArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await fetch("/api/spotify/artists")
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        setArtists(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchArtists()
  }, [])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">
          Tous tes{" "}
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            Artistes
          </span>
        </h1>
        <p className="mb-8 text-gray-400">Découvre l'ensemble de tes artistes préférés de tous les temps.</p>

        {loading && <p>Chargement des artistes...</p>}
        {error && <p className="text-red-500">Erreur: {error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/20 text-lg font-bold text-[#1DB954]">
                    {index + 1}
                  </span>
                  {artist.images?.[0]?.url && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">{artist.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {artist.genres.length > 0 ? artist.genres.join(", ") : "Genre inconnu"}
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
