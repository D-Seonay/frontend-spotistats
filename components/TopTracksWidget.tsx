import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Disc } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParsedStats } from "@/lib/types"
import { useSpotifyTrackImage } from "@/lib/hooks/useSpotifyTrackImage"

interface TopTracksWidgetProps {
  topTracks: ParsedStats["topTracks"]
}

function TrackItem({ track, index }: { track: { name: string, artist: string, plays: number }, index: number }) {
  const imageUrl = useSpotifyTrackImage(track.name, track.artist)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
          {index + 1}
        </span>
        {imageUrl ? (
          <img src={imageUrl} alt={track.name} className="h-10 w-10 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10">
            <Disc className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium line-clamp-1">{track.name}</p>
          <p className="text-sm text-gray-400 line-clamp-1">
            {track.artist}
          </p>
        </div>
      </div>
      <span className="text-sm text-gray-400 shrink-0 ml-2">
        {track.plays} écoutes
      </span>
    </div>
  )
}

export function TopTracksWidget({ topTracks }: TopTracksWidgetProps) {
  return (
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
          {topTracks.length > 0 ? (
            topTracks.slice(0, 5).map((track, index) => (
              <TrackItem key={track.name + track.artist + index} track={track} index={index} />
            ))
          ) : (
            <p className="text-gray-400">Aucun titre trouvé.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
