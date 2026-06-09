import Link from "next/link"
import { User } from "lucide-react"
import { ParsedStats } from "@/lib/types"
import { useSpotifyArtistImage } from "@/lib/hooks/useSpotifyArtistImage"

interface TopArtistsWidgetProps {
  topArtists: ParsedStats["topArtists"]
}

function ArtistRow({
  artist,
  index,
  maxPlays,
}: {
  artist: { name: string; plays: number }
  index: number
  maxPlays: number
}) {
  const imageUrl = useSpotifyArtistImage(artist.name)
  const barWidth = Math.round((artist.plays / maxPlays) * 100)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 900,
          color: index === 0 ? "#1DB954" : "#d5d0c8",
          width: 36,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={artist.name}
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#d5d0c8",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User style={{ width: 16, height: 16, color: "#888" }} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 12,
            fontWeight: 700,
            color: "#111",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 5,
          }}
        >
          {artist.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 2, background: "#d5d0c8" }}>
            <div style={{ width: `${barWidth}%`, height: "100%", background: "#111" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 10,
              color: "#666",
              flexShrink: 0,
            }}
          >
            {artist.plays}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopArtistsWidget({ topArtists }: TopArtistsWidgetProps) {
  const maxPlays = topArtists.length > 0 ? topArtists[0].plays : 1

  return (
    <div style={{ padding: "20px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 10,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Top 5 Artistes
        </p>
        <Link
          href="/all-artists"
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 10,
            color: "#1DB954",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          Voir tout →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {topArtists.length > 0 ? (
          topArtists
            .slice(0, 5)
            .map((artist, index) => (
              <ArtistRow key={artist.name + index} artist={artist} index={index} maxPlays={maxPlays} />
            ))
        ) : (
          <p style={{ fontFamily: "var(--font-mono-brand)", fontSize: 12, color: "#666" }}>
            Aucun artiste trouvé.
          </p>
        )}
      </div>
    </div>
  )
}
