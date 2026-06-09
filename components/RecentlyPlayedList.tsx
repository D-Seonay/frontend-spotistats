"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/DataContext"
import { getRecentlyPlayed } from "@/lib/spotify"
import { SpotifyRecentlyPlayedItem, SpotifyStreamingData } from "@/lib/types"

export function RecentlyPlayedList() {
  const { apiData, setApiData } = useData()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      setLoading(true)
      try {
        const data = await getRecentlyPlayed(50)
        if (data && data.items) {
          const mappedData: SpotifyStreamingData[] = data.items.map((item: SpotifyRecentlyPlayedItem) => ({
            endTime: item.played_at.replace("T", " ").substring(0, 16), // Format YYYY-MM-DD HH:MM
            artistName: item.track.artists[0].name,
            trackName: item.track.name,
            msPlayed: item.track.duration_ms, // Recently played doesn't give msPlayed, we use duration
          }))
          
          // Only update if data is different to avoid infinite loops if this was triggered by apiData change
          // (though here it's on mount only)
          setApiData(mappedData)
        }
      } catch (error) {
        console.error("Error fetching recently played:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayed()
  }, [setApiData])

  if (loading && apiData.length === 0) {
    return (
      <div className="p-4">
        <p style={{ fontFamily: "var(--font-mono-brand)", fontSize: 11, color: "#666" }}>
          Chargement de l'historique récent...
        </p>
      </div>
    )
  }

  if (apiData.length === 0) return null

  // Show only last 15 for the list
  const recentTracks = apiData.slice(0, 15)

  return (
    <div style={{ border: "2px solid #111", background: "#fff" }}>
      <div style={{ borderBottom: "2px solid #111", padding: "10px 16px", background: "#f2ede4" }}>
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 10,
            color: "#111",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#1DB954" }}>● </span>
          Récemment écoutés
        </p>
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {recentTracks.map((track, i) => (
          <div
            key={`${track.endTime}-${i}`}
            style={{
              padding: "10px 16px",
              borderBottom: i === recentTracks.length - 1 ? "none" : "1px solid #eee",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {track.trackName}
            </p>
            <div className="flex justify-between items-center">
              <p
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 11,
                  color: "#666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {track.artistName}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 9,
                  color: "#999",
                }}
              >
                {new Date(track.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
