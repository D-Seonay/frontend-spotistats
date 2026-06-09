"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/DataContext"
import { getNowPlaying } from "@/lib/spotify"
import { Music, Play, Pause } from "lucide-react"

export function NowPlayingBar() {
  const { nowPlaying, setNowPlaying } = useData()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const data = await getNowPlaying()
        if (data && data.item) {
          setNowPlaying(data)
        } else {
          setNowPlaying(null)
        }
      } catch (error) {
        console.error("Error fetching now playing:", error)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)

    return () => clearInterval(interval)
  }, [setNowPlaying])

  useEffect(() => {
    if (nowPlaying?.is_playing && nowPlaying.item) {
      const duration = nowPlaying.item.duration_ms
      const initialProgress = (nowPlaying.progress_ms / duration) * 100
      setProgress(initialProgress)

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (1000 / duration) * 100
          return next > 100 ? 100 : next
        })
      }, 1000)

      return () => clearInterval(progressInterval)
    }
  }, [nowPlaying])

  if (!nowPlaying || !nowPlaying.item) {
    return null
  }

  const { item, is_playing } = nowPlaying
  const artistNames = item.artists.map((a) => a.name).join(", ")
  const albumImage = item.album.images[0]?.url

  return (
    <div className="fixed bottom-0 left-0 sm:left-16 right-0 z-50 bg-[#111] text-white border-t-2 border-black">
      <div className="h-1 w-full bg-[#333]">
        <div 
          className="h-full bg-[#1DB954] transition-all duration-1000 ease-linear" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="relative h-12 w-12 flex-shrink-0 border-2 border-black bg-[#222]">
            {albumImage ? (
              <img src={albumImage} alt={item.album.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-6 w-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="truncate font-bold text-sm sm:text-base leading-tight">
              {item.name}
            </h4>
            <p className="truncate text-xs sm:text-sm text-gray-400 font-mono">
              {artistNames}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 bg-[#1DB954] border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {is_playing ? <Pause className="h-5 w-5 text-black" /> : <Play className="h-5 w-5 text-black" />}
          </div>
          <div className="hidden sm:block">
             <span className="text-[10px] font-mono text-[#1DB954] uppercase tracking-wider">
               Now Playing
             </span>
          </div>
        </div>
      </div>
    </div>
  )
}
