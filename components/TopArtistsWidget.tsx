import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParsedStats } from "@/lib/types"
import { useSpotifyArtistImage } from "@/lib/hooks/useSpotifyArtistImage"

interface TopArtistsWidgetProps {
  topArtists: ParsedStats["topArtists"]
}

function ArtistItem({ artist, index }: { artist: { name: string, plays: number }, index: number }) {
  const imageUrl = useSpotifyArtistImage(artist.name)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
          {index + 1}
        </span>
        {imageUrl ? (
          <img src={imageUrl} alt={artist.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <p className="font-medium line-clamp-1">{artist.name}</p>
      </div>
      <span className="text-sm text-gray-400 shrink-0">
        {artist.plays} écoutes
      </span>
    </div>
  )
}

export function TopArtistsWidget({ topArtists }: TopArtistsWidgetProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#1DB954]" />
            Top 5 Artistes
          </CardTitle>
          <CardDescription className="text-gray-400">Tes artistes préférés</CardDescription>
        </div>
        <Link href="/all-artists">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#1DB954]">
            Voir tout
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topArtists.length > 0 ? (
            topArtists.slice(0, 5).map((artist, index) => (
              <ArtistItem key={artist.name + index} artist={artist} index={index} />
            ))
          ) : (
            <p className="text-gray-400">Aucun artiste trouvé.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
