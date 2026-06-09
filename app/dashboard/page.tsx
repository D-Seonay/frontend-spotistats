"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import AppLayout, { useAppFilters } from "@/components/AppLayout"
import { useData } from "@/lib/DataContext"
import { CsvImporter, analyzeData } from "@/components/CsvImporter"
import { applyAppFilters } from "@/lib/filters"
import { calculateAdvancedStats } from "@/lib/stats-utils"
import { ActivityHeatmap } from "@/components/ActivityHeatmap"
import { TopArtistsWidget } from "@/components/TopArtistsWidget"
import { TopTracksWidget } from "@/components/TopTracksWidget"
import { NowPlayingBar } from "@/components/NowPlayingBar"
import SpotifyPlayer from "@/components/SpotifyPlayer"
import { ParsedStats, SpotifyStreamingData } from "@/lib/types"

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onImport }: { onImport: () => void }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-8 p-12"
      style={{ background: "#f2ede4" }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span style={{ fontSize: 56 }}>🎧</span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 900,
            color: "#111",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          Tes données t'attendent
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 13,
            color: "#555",
            maxWidth: 420,
          }}
        >
          Importe tes fichiers d'historique Spotify pour voir tes stats d'écoute.
        </p>
      </div>

      {/* Steps */}
      <div className="flex gap-4">
        {[
          { num: "01", text: "Demander l'export sur Spotify" },
          { num: "02", text: "Attendre l'email (quelques jours)" },
          { num: "03", text: "Importer le fichier ici" },
        ].map((step) => (
          <div
            key={step.num}
            className="flex flex-col gap-2 p-4"
            style={{ border: "2px solid #111", width: 160 }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 900,
                color: "#d5d0c8",
                lineHeight: 1,
              }}
            >
              {step.num}
            </span>
            <p
              style={{
                fontFamily: "var(--font-mono-brand)",
                fontSize: 11,
                color: "#555",
                lineHeight: 1.4,
              }}
            >
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onImport}
        style={{
          fontFamily: "var(--font-mono-brand)",
          fontSize: 13,
          fontWeight: 700,
          background: "#1DB954",
          color: "#000",
          border: "none",
          padding: "14px 32px",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Importer mes données Spotify
      </button>
    </div>
  )
}

// ─── Stat Block ───────────────────────────────────────────────────────────────

function StatBlock({
  eyebrow,
  value,
  accent,
}: {
  eyebrow: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className="flex flex-col justify-center p-5"
      style={{ borderLeft: "2px solid #111" }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono-brand)",
          fontSize: 10,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 40,
          fontWeight: 900,
          color: accent ? "#1DB954" : "#111",
          lineHeight: 1,
          letterSpacing: "-1px",
        }}
      >
        {value}
      </p>
    </div>
  )
}

// ─── Dashboard Content ────────────────────────────────────────────────────────

function DashboardContent() {
  const { allRawData, importedStats, setImportedData, nowPlaying } = useData()
  const { filters } = useAppFilters()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"overview" | "import">("overview")

  useEffect(() => {
    if (searchParams.get("tab") === "import") setActiveTab("import")
  }, [searchParams])

  const filteredRawData = useMemo(
    () => applyAppFilters(allRawData, filters),
    [allRawData, filters],
  )

  const displayStats = useMemo(() => {
    if (!importedStats) return null
    if (filteredRawData.length === 0) return null
    return analyzeData(filteredRawData)
  }, [importedStats, filteredRawData])

  const advancedStats = useMemo(() => {
    if (!importedStats) return null
    if (filteredRawData.length === 0) return null
    return calculateAdvancedStats(filteredRawData)
  }, [importedStats, filteredRawData])

  const filterLabel = useMemo(() => {
    if (filters.dateFrom || filters.dateTo) {
      return `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`
    }
    if (filters.artistName) return filters.artistName
    if (filters.trackName) return filters.trackName
    return filters.year ?? "Tout"
  }, [filters])

  const handleDataImported = (stats: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedData(stats, rawData)
    setActiveTab("overview")
  }

  if (activeTab === "import") {
    return (
      <div className="p-6" style={{ background: "#f2ede4" }}>
        <CsvImporter onDataImported={handleDataImported} />
      </div>
    )
  }

  if (!importedStats) {
    return <EmptyState onImport={() => setActiveTab("import")} />
  }

  if (!displayStats) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 13,
            color: "#555",
          }}
        >
          Aucune donnée ne correspond aux filtres actifs.
        </p>
      </div>
    )
  }

  const hours = Math.round(displayStats.totalMinutes / 60)

  return (
    <div style={{ background: "#f2ede4", paddingBottom: nowPlaying ? "80px" : "0px" }}>

      {/* ── Hero section ── */}
      <div style={{ border: "2px solid #111" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr 1fr 1fr",
          }}
        >
          {/* Big time block */}
          <div
            style={{
              borderRight: "2px solid #111",
              padding: "24px 32px",
              minWidth: 240,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono-brand)",
                fontSize: 10,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 8,
              }}
            >
              Temps d'écoute · {filterLabel}
            </p>
            <div style={{ lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 80,
                  fontWeight: 900,
                  color: "#111",
                  letterSpacing: "-3px",
                }}
              >
                {hours.toLocaleString()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 900,
                  color: "#1DB954",
                  letterSpacing: "0",
                }}
              >
                h
              </span>
            </div>
          </div>

          <StatBlock eyebrow="Titres uniques" value={displayStats.uniqueTracks.toLocaleString()} />
          <StatBlock eyebrow="Artistes" value={displayStats.uniqueArtists.toLocaleString()} />
          <StatBlock
            eyebrow="Pic d'écoute"
            value={advancedStats ? `${advancedStats.peakListeningHour}h` : "—"}
            accent
          />
        </div>
      </div>

      {/* ── Heatmap + Player ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 160px",
          border: "2px solid #111",
          borderTop: "none",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRight: "2px solid #111",
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 10,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#1DB954", fontWeight: 700 }}>// </span>
            Activité · {filterLabel}
          </p>
          <ActivityHeatmap data={displayStats.dailyData} />
        </div>
        <div
          style={{
            background: "#111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            gap: 12,
          }}
        >
          <SpotifyPlayer />
        </div>
      </div>

      {/* ── Top Lists ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "2px solid #111",
          borderTop: "none",
        }}
      >
        <div style={{ borderRight: "2px solid #111" }}>
          <TopArtistsWidget topArtists={displayStats.topArtists} />
        </div>
        <TopTracksWidget topTracks={displayStats.topTracks} />
      </div>

      <NowPlayingBar />
    </div>
  )
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div style={{ background: "#f2ede4", height: "100%" }} />}>
        <DashboardContent />
      </Suspense>
    </AppLayout>
  )
}
