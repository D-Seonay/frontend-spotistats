"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface Track {
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  uri: string
}

interface SpotifyPlayerProps {
  onReady?: (deviceId: string) => void
}

// Declare Spotify global object
declare global {
  interface Window {
    Spotify: any
    onSpotifyWebPlaybackSDKReady: () => void
  }
}

export default function SpotifyPlayer({ onReady }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string>("")
  const [isPaused, setIsPaused] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const accessTokenRef = useRef<string>("")
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = initializePlayer

    return () => {
      if (player) {
        player.disconnect()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    if (isActive && !isPaused) {
      progressIntervalRef.current = setInterval(() => {
        setPosition((pos) => pos + 1000)
      }, 1000)
    }
  }, [isActive, isPaused])

  const initializePlayer = async () => {
    try {
      const tokenResponse = await fetch("/api/auth/token")
      if (!tokenResponse.ok) {
        throw new Error("Failed to get access token")
      }
      const { access_token } = await tokenResponse.json()
      accessTokenRef.current = access_token

      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Listener Stats Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessTokenRef.current)
        },
        volume: 0.5,
      })

      spotifyPlayer.addListener("initialization_error", ({ message }: any) => {
        console.error("[v0] Initialization error:", message)
        setError("Erreur d'initialisation du lecteur")
      })
      spotifyPlayer.addListener("authentication_error", ({ message }: any) => {
        console.error("[v0] Authentication error:", message)
        setError("Erreur d'authentification")
        refreshToken()
      })
      spotifyPlayer.addListener("account_error", ({ message }: any) => {
        console.error("[v0] Account error:", message)
        setError("Erreur de compte - Spotify Premium requis")
      })
      spotifyPlayer.addListener("playback_error", ({ message }: any) => {
        console.error("[v0] Playback error:", message)
        setError("Erreur de lecture")
      })

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) {
          setIsActive(false)
          return
        }
        setCurrentTrack(state.track_window.current_track)
        setIsPaused(state.paused)
        setPosition(state.position)
        setDuration(state.duration)
        setIsActive(true)
      })

      spotifyPlayer.addListener("ready", ({ device_id }: any) => {
        console.log("[v0] Player ready with Device ID:", device_id)
        setDeviceId(device_id)
        setPlayer(spotifyPlayer)
        if (onReady) {
          onReady(device_id)
        }
      })

      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        console.log("[v0] Device ID has gone offline:", device_id)
      })

      const connected = await spotifyPlayer.connect()
      if (connected) {
        console.log("[v0] Successfully connected to Spotify")
      }
    } catch (err) {
      console.error("[v0] Player initialization error:", err)
      setError("Impossible d'initialiser le lecteur")
    }
  }

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" })
      if (response.ok) {
        const tokenResponse = await fetch("/api/auth/token")
        const { access_token } = await tokenResponse.json()
        accessTokenRef.current = access_token
        setError(null)
      }
    } catch (err) {
      console.error("[v0] Token refresh error:", err)
    }
  }

  const togglePlay = () => player?.togglePlay()
  const skipToNext = () => player?.nextTrack()
  const skipToPrevious = () => player?.previousTrack()

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    player?.setVolume(newVolume / 100)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }
  
  const handleSeek = (value: number[]) => {
    const newPosition = value[0]
    setPosition(newPosition)
    player?.seek(newPosition)
  }

  const toggleMute = () => {
    if (isMuted) {
      player?.setVolume(volume / 100)
      setIsMuted(false)
    } else {
      player?.setVolume(0)
      setIsMuted(true)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/10">
        <CardContent className="p-6">
          <p className="text-center text-red-400">{error}</p>
          {error.includes("Premium") && (
            <p className="mt-2 text-center text-sm text-gray-400">
              Le Web Playback SDK nécessite un compte Spotify Premium
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!isActive || !currentTrack) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-6">
          <p className="text-center text-gray-400">
            {player ? "Lance une musique depuis ton app Spotify pour la contrôler ici" : "Chargement du lecteur..."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/10 to-black">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {currentTrack.album.images[0] && (
              <img
                src={currentTrack.album.images[0].url || "/placeholder.svg"}
                alt={currentTrack.album.name}
                className="h-20 w-20 rounded-lg shadow-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white">{currentTrack.name}</h3>
              <p className="text-sm text-gray-400">{currentTrack.artists.map((a) => a.name).join(", ")}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-center gap-4">
              <Button size="icon" variant="ghost" onClick={skipToPrevious} className="hover:text-[#1DB954]">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-[#1DB954] hover:scale-110 hover:bg-[#1ed760]"
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={skipToNext} className="hover:text-[#1DB954]">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{formatTime(position)}</span>
              <Slider
                value={[position]}
                onValueChange={handleSeek}
                max={duration}
                step={1000}
                className="flex-1"
              />
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleMute} className="hover:text-[#1DB954]">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
