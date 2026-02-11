// lib/hooks/useSpotifyTrackImage.ts
import { useState, useEffect } from "react"
import { searchSpotify } from "@/lib/spotify"

// Simple in-memory cache
const imageCache = new Map<string, string | null>()

export function useSpotifyTrackImage(trackName: string, artistName: string): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!trackName || !artistName) {
      setImageUrl(null)
      return
    }

    const cacheKey = `${trackName}-${artistName}`
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey)!)
      return
    }

    const fetchImage = async () => {
      const query = `track:${trackName} artist:${artistName}`
      const result = await searchSpotify(query, "track", 1)

      if (result?.tracks?.items && result.tracks.items.length > 0) {
        const album = result.tracks.items[0].album
        if (album?.images && album.images.length > 0) {
          const url = album.images.find((img: any) => img.height === 64 || img.height === 300)?.url || album.images[0].url
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
  }, [trackName, artistName])

  return imageUrl
}
