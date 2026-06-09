"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Filter, ChevronDown, ChevronUp, Calendar, User, Music, Clock } from "lucide-react"
import AppLayout from "@/components/AppLayout"
import { CsvImporter } from "@/components/CsvImporter"
import { useData } from "@/lib/DataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSpotifyTrackImage } from "@/lib/hooks/useSpotifyTrackImage"
import { SpotifyStreamingData, ParsedStats, Filters } from "@/lib/DataContext"

// ─── Track Card ───────────────────────────────────────────────────────────────

function TrackCard({
  track,
  rank,
}: {
  track: { name: string; artist: string; plays: number }
  rank: number
}) {
  const imageUrl = useSpotifyTrackImage(track.name, track.artist)

  return (
    <div style={{ border: "2px solid #111", background: "#f2ede4", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 900,
            color: "#d5d0c8",
            width: 40,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {String(rank).padStart(2, "0")}
        </span>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={track.name}
            style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: "#d5d0c8",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Music style={{ width: 16, height: 16, color: "#888" }} />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 13,
              fontWeight: 700,
              color: "#111",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {track.name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 11,
              color: "#666",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {track.artist}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 11,
              color: "#888",
              marginTop: 2,
            }}
          >
            {track.plays} écoutes
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AllMusicContent() {
  const { allRawData, importedStats, setImportedData } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    artistSearch: "",
    trackSearch: "",
    dateFrom: "",
    dateTo: "",
    minPlaytime: 0,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const handleDataImported = (data: ParsedStats, rawData: SpotifyStreamingData[]) => {
    setImportedData(data, rawData)
  }

  const resetFilters = () => {
    setFilters({ artistSearch: "", trackSearch: "", dateFrom: "", dateTo: "", minPlaytime: 0 })
    setCurrentPage(1)
  }

  const dataAfterFilters = useMemo(() => {
    if (allRawData.length === 0) return []
    return allRawData.filter((item) => {
      if (filters.artistSearch && !item.artistName.toLowerCase().includes(filters.artistSearch.toLowerCase())) return false
      if (filters.trackSearch && !item.trackName.toLowerCase().includes(filters.trackSearch.toLowerCase())) return false
      if (filters.dateFrom && item.endTime && new Date(item.endTime) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && item.endTime && new Date(item.endTime) > new Date(filters.dateTo)) return false
      if (filters.minPlaytime > 0 && item.msPlayed / 60000 < filters.minPlaytime) return false
      return true
    })
  }, [allRawData, filters])

  const allUniqueTracks = useMemo(() => {
    if (!importedStats || dataAfterFilters.length === 0) return []
    const map = new Map<string, { name: string; artist: string; plays: number }>()
    dataAfterFilters.forEach((item) => {
      const key = `${item.trackName}-${item.artistName}`
      const existing = map.get(key)
      if (existing) existing.plays++
      else map.set(key, { name: item.trackName, artist: item.artistName, plays: 1 })
    })
    return Array.from(map.values()).sort((a, b) => b.plays - a.plays)
  }, [importedStats, dataAfterFilters])

  const searchedTracks = useMemo(() => {
    if (!searchTerm) return allUniqueTracks
    const lc = searchTerm.toLowerCase()
    return allUniqueTracks.filter(
      (t) => t.name.toLowerCase().includes(lc) || t.artist.toLowerCase().includes(lc)
    )
  }, [allUniqueTracks, searchTerm])

  const totalPages = Math.ceil(searchedTracks.length / itemsPerPage)

  const paginatedTracks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return searchedTracks.slice(start, start + itemsPerPage)
  }, [searchedTracks, currentPage, itemsPerPage])

  const hasActiveFilters =
    !!filters.artistSearch || !!filters.trackSearch || !!filters.dateFrom || !!filters.dateTo || filters.minPlaytime > 0

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono-brand)",
    fontSize: 12,
    background: "transparent",
    border: "2px solid #111",
    color: "#111",
    padding: "8px 12px",
    outline: "none",
    width: "100%",
  }

  return (
    <div style={{ padding: "32px 40px", background: "#f2ede4", minHeight: "100%" }}>

      {/* Page title */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 48,
            fontWeight: 900,
            color: "#111",
            lineHeight: 1,
            letterSpacing: "-2px",
            marginBottom: 8,
          }}
        >
          Toutes tes{" "}
          <span style={{ color: "#1DB954" }}>Musiques</span>
        </h1>
        {importedStats && (
          <p
            style={{
              fontFamily: "var(--font-mono-brand)",
              fontSize: 12,
              color: "#666",
            }}
          >
            {searchedTracks.length} titre{searchedTracks.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!importedStats && (
        <div style={{ marginBottom: 32 }}>
          <CsvImporter onDataImported={(stats, rawData) => handleDataImported(stats, rawData)} />
        </div>
      )}

      {importedStats && (
        <>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Rechercher un titre ou un artiste…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              style={{ ...inputStyle, width: 280 }}
            />

            <button
              onClick={() => setShowFilters((p) => !p)}
              style={{
                fontFamily: "var(--font-mono-brand)",
                fontSize: 11,
                fontWeight: 700,
                background: showFilters ? "#111" : "transparent",
                border: "2px solid #111",
                color: showFilters ? "#f2ede4" : "#111",
                padding: "8px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <Filter style={{ width: 12, height: 12 }} />
              Filtres
              {hasActiveFilters && (
                <span
                  style={{
                    background: "#1DB954",
                    color: "#000",
                    borderRadius: 0,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  Actifs
                </span>
              )}
              {showFilters ? (
                <ChevronUp style={{ width: 12, height: 12 }} />
              ) : (
                <ChevronDown style={{ width: 12, height: 12 }} />
              )}
            </button>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 11,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Par page
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1) }}
              >
                <SelectTrigger
                  style={{
                    fontFamily: "var(--font-mono-brand)",
                    fontSize: 11,
                    width: 80,
                    border: "2px solid #111",
                    borderRadius: 0,
                    background: "transparent",
                    color: "#111",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "#f2ede4",
                    border: "2px solid #111",
                    borderRadius: 0,
                    fontFamily: "var(--font-mono-brand)",
                    fontSize: 11,
                  }}
                >
                  {["10", "25", "50", "100"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div
              style={{
                border: "2px solid #111",
                borderBottom: "none",
                padding: "20px 24px",
                marginBottom: 0,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {[
                { label: "Artiste", icon: <User style={{ width: 12, height: 12 }} />, field: "artistSearch" as const },
                { label: "Titre", icon: <Music style={{ width: 12, height: 12 }} />, field: "trackSearch" as const },
              ].map(({ label, icon, field }) => (
                <div key={field}>
                  <label
                    style={{
                      fontFamily: "var(--font-mono-brand)",
                      fontSize: 10,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 6,
                    }}
                  >
                    {icon} {label}
                  </label>
                  <input
                    placeholder={`Filtrer par ${label.toLowerCase()}…`}
                    value={filters[field]}
                    onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    fontFamily: "var(--font-mono-brand)",
                    fontSize: 10,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  <Clock style={{ width: 12, height: 12 }} /> Durée min (min)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPlaytime || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPlaytime: parseInt(e.target.value) || 0 })
                  }
                  style={inputStyle}
                />
              </div>

              {[
                { label: "Date de début", field: "dateFrom" as const },
                { label: "Date de fin", field: "dateTo" as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label
                    style={{
                      fontFamily: "var(--font-mono-brand)",
                      fontSize: 10,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 6,
                    }}
                  >
                    <Calendar style={{ width: 12, height: 12 }} /> {label}
                  </label>
                  <input
                    type="date"
                    value={filters[field]}
                    onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={resetFilters}
                  style={{
                    fontFamily: "var(--font-mono-brand)",
                    fontSize: 11,
                    fontWeight: 700,
                    background: "transparent",
                    border: "2px solid #111",
                    color: "#111",
                    padding: "8px 16px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    width: "100%",
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              border: "2px solid #111",
            }}
          >
            {paginatedTracks.length === 0 ? (
              <p
                style={{
                  gridColumn: "1 / -1",
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 13,
                  color: "#666",
                  padding: "32px 24px",
                }}
              >
                Aucun titre trouvé.
              </p>
            ) : (
              paginatedTracks.map((track, index) => (
                <div
                  key={track.name + track.artist}
                  style={{
                    borderRight: (index + 1) % 4 !== 0 ? "2px solid #111" : "none",
                    borderBottom: "2px solid #111",
                  }}
                >
                  <TrackCard
                    track={track}
                    rank={(currentPage - 1) * itemsPerPage + index + 1}
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginTop: 24,
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 11,
                  fontWeight: 700,
                  background: "transparent",
                  border: "2px solid #111",
                  color: currentPage === 1 ? "#bbb" : "#111",
                  borderColor: currentPage === 1 ? "#bbb" : "#111",
                  padding: "8px 16px",
                  cursor: currentPage === 1 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <ChevronLeft style={{ width: 12, height: 12 }} /> Préc.
              </button>
              <span
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 12,
                  color: "#555",
                }}
              >
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 11,
                  fontWeight: 700,
                  background: "transparent",
                  border: "2px solid #111",
                  color: currentPage === totalPages ? "#bbb" : "#111",
                  borderColor: currentPage === totalPages ? "#bbb" : "#111",
                  padding: "8px 16px",
                  cursor: currentPage === totalPages ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Suiv. <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AllMusicPage() {
  return (
    <AppLayout>
      <AllMusicContent />
    </AppLayout>
  )
}
