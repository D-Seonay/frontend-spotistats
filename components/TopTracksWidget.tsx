import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParsedStats } from "@/lib/types"

interface TopTracksWidgetProps {
  topTracks: ParsedStats["topTracks"]
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
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucun titre trouvé.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
