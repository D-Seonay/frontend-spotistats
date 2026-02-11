// lib/hooks/useSpotifyArtistImage.ts
import { useState, useEffect } from "react"
import { searchSpotify } from "@/lib/spotify"

// Simple in-memory cache
const imageCache = new Map<string, string | null>()

export function useSpotifyArtistImage(artistName: string): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!artistName) {
      setImageUrl(null)
      return
    }

    const cacheKey = artistName
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey)!)
      return
    }

    const fetchImage = async () => {
      const query = `artist:${artistName}`
      const result = await searchSpotify(query, "artist", 1)

      if (result?.artists?.items && result.artists.items.length > 0) {
        const artist = result.artists.items[0]
        if (artist?.images && artist.images.length > 0) {
          const url = artist.images.find((img: any) => img.height === 64 || img.height === 300)?.url || artist.images[0].url
          setImageUrl(url)
          imageCache.set(cacheKey, url)
        } else {
          setImageUrl(null)
          imageCache.set(cacheKey, null)
        }
      } else {
        setImageUrl(null)
        imageCache.set(cacheKey, null)
      }
    }

    fetchImage()
  }, [artistName])

  return imageUrl
}
