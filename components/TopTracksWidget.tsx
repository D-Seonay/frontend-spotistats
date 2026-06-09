import Link from "next/link"
import { Disc } from "lucide-react"
import { ParsedStats } from "@/lib/types"
import { useSpotifyTrackImage } from "@/lib/hooks/useSpotifyTrackImage"

interface TopTracksWidgetProps {
  topTracks: ParsedStats["topTracks"]
}

function TrackRow({
  track,
  index,
  maxPlays,
}: {
  track: { name: string; artist: string; plays: number }
  index: number
  maxPlays: number
}) {
  const imageUrl = useSpotifyTrackImage(track.name, track.artist)
  const barWidth = Math.round((track.plays / maxPlays) * 100)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 900,
          color: index === 0 ? "#1DB954" : "#d5d0c8",
          width: 48,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={track.name}
          style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 48,
            height: 48,
            background: "#d5d0c8",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Disc style={{ width: 20, height: 20, color: "#888" }} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 14,
            fontWeight: 700,
            color: "#111",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 2,
          }}
        >
          {track.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 13,
            color: "#666",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 4,
          }}
        >
          {track.artist}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: "#d5d0c8" }}>
            <div style={{ width: `${barWidth}%`, height: "100%", background: "#111" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 12,
              color: "#666",
              flexShrink: 0,
            }}
          >
            {track.plays}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopTracksWidget({ topTracks }: TopTracksWidgetProps) {
  const maxPlays = topTracks.length > 0 ? topTracks[0].plays : 1

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
          Top 5 Titres
        </p>
        <Link
          href="/all-music"
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
        {topTracks.length > 0 ? (
          topTracks
            .slice(0, 5)
            .map((track, index) => (
              <TrackRow
                key={track.name + track.artist + index}
                track={track}
                index={index}
                maxPlays={maxPlays}
              />
            ))
        ) : (
          <p style={{ fontFamily: "var(--font-mono-brand)", fontSize: 12, color: "#666" }}>
            Aucun titre trouvé.
          </p>
        )}
      </div>
    </div>
  )
}
