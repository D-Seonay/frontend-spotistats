"use client"

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Music, Upload, LogOut } from "lucide-react"
import { AppFilters, DEFAULT_FILTERS } from "@/lib/filters"

// ─── Filter Context ───────────────────────────────────────────────────────────

interface AppFiltersContextType {
  filters: AppFilters
  setFilters: (f: AppFilters) => void
  resetFilters: () => void
}

const AppFiltersContext = createContext<AppFiltersContextType | undefined>(undefined)

export function useAppFilters(): AppFiltersContextType {
  const ctx = useContext(AppFiltersContext)
  if (!ctx) throw new Error("useAppFilters must be used inside AppLayout")
  return ctx
}

// ─── NavIcon ──────────────────────────────────────────────────────────────────

function NavIcon({
  href,
  icon,
  label,
  active,
  accentIcon,
}: {
  href: string
  icon: ReactNode
  label: string
  active: boolean
  accentIcon?: boolean
}) {
  return (
    <Link
      href={href}
      title={label}
      className="flex h-10 w-10 items-center justify-center transition-colors"
      style={{
        background: active ? "#1DB954" : "transparent",
        border: `1px solid ${active ? "#1DB954" : "transparent"}`,
        color: active ? "#000" : accentIcon ? "#1DB954" : "#777",
      }}
    >
      {icon}
    </Link>
  )
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

const YEAR_CHIPS = ["2022", "2023", "2024"]

function TopBar({
  filters,
  setFilters,
  resetFilters,
}: {
  filters: AppFilters
  setFilters: (f: AppFilters) => void
  resetFilters: () => void
}) {
  const pathname = usePathname()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showArtistInput, setShowArtistInput] = useState(false)
  const [showTrackInput, setShowTrackInput] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showDatePicker) return
    function handleOutsideClick(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [showDatePicker])

  const pageLabel =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/all-artists"
        ? "Artistes"
        : pathname === "/all-music"
          ? "Titres"
          : ""

  const isDashboard = pathname === "/dashboard"

  const hasActiveFilters =
    !!filters.year ||
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.artistName ||
    !!filters.trackName

  const chipStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono-brand, monospace)",
    fontSize: 11,
    fontWeight: active ? 700 : 400,
    background: active ? "#1DB954" : "transparent",
    border: `1px solid ${active ? "#1DB954" : "#444"}`,
    color: active ? "#000" : "#bbb",
    padding: "0 8px",
    height: 24,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  })

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono-brand, monospace)",
    fontSize: 11,
    height: 24,
    width: 112,
    background: "transparent",
    border: "1px solid #1DB954",
    color: "#1DB954",
    padding: "0 8px",
    outline: "none",
    flexShrink: 0,
  }

  return (
    <div
      className="relative flex flex-shrink-0 flex-wrap items-center gap-2 px-4"
      style={{ background: "#111", borderBottom: "2px solid #1a1a1a", minHeight: 44 }}
    >
      <span
        className="mr-1 text-xs uppercase tracking-widest"
        style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, color: "#f2ede4" }}
      >
        {pageLabel}
      </span>

      {isDashboard && (
        <>
          <div className="h-4 w-px mx-1" style={{ background: "#333" }} />

          {/* Year chips */}
          {YEAR_CHIPS.map((y) => (
            <button
              key={y}
              onClick={() =>
                setFilters({ ...filters, year: filters.year === y ? null : y, dateFrom: "", dateTo: "" })
              }
              style={chipStyle(filters.year === y)}
            >
              {y}
            </button>
          ))}
          <button
            onClick={() => setFilters({ ...filters, year: null, dateFrom: "", dateTo: "" })}
            style={chipStyle(!filters.year && !filters.dateFrom && !filters.dateTo)}
          >
            Tout
          </button>

          <div className="h-4 w-px mx-1" style={{ background: "#333" }} />

          {/* Date range */}
          <button
            onClick={() => setShowDatePicker((p) => !p)}
            style={chipStyle(!!(filters.dateFrom || filters.dateTo))}
          >
            {filters.dateFrom || filters.dateTo
              ? `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`
              : "Plage ▾"}
          </button>

          {/* Artist */}
          {showArtistInput ? (
            <input
              autoFocus
              value={filters.artistName}
              onChange={(e) => setFilters({ ...filters, artistName: e.target.value })}
              onBlur={() => { if (!filters.artistName) setShowArtistInput(false) }}
              placeholder="Artiste…"
              style={inputStyle}
            />
          ) : (
            <button
              onClick={() => setShowArtistInput(true)}
              style={chipStyle(!!filters.artistName)}
            >
              {filters.artistName ? `👤 ${filters.artistName}` : "👤 Artiste ▾"}
            </button>
          )}

          {/* Track */}
          {showTrackInput ? (
            <input
              autoFocus
              value={filters.trackName}
              onChange={(e) => setFilters({ ...filters, trackName: e.target.value })}
              onBlur={() => { if (!filters.trackName) setShowTrackInput(false) }}
              placeholder="Titre…"
              style={inputStyle}
            />
          ) : (
            <button
              onClick={() => setShowTrackInput(true)}
              style={chipStyle(!!filters.trackName)}
            >
              {filters.trackName ? `♪ ${filters.trackName}` : "♪ Titre ▾"}
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => {
                resetFilters()
                setShowArtistInput(false)
                setShowTrackInput(false)
                setShowDatePicker(false)
              }}
              className="ml-auto transition-colors hover:text-[#bbb]"
              style={{
                fontFamily: "var(--font-mono-brand, monospace)",
                fontSize: 11,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              Réinit.
            </button>
          )}

          {/* Date picker dropdown */}
          {showDatePicker && (
            <div
              ref={datePickerRef}
              className="absolute left-0 top-full z-50 flex items-end gap-3 p-3"
              style={{
                background: "#1a1a1a",
                border: "2px solid #111",
                borderTop: "none",
              }}
            >
              {(["De", "À"] as const).map((lbl, i) => (
                <div key={lbl} className="flex flex-col gap-1">
                  <label
                    style={{
                      fontFamily: "var(--font-mono-brand, monospace)",
                      fontSize: 10,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {lbl}
                  </label>
                  <input
                    type="date"
                    value={i === 0 ? filters.dateFrom : filters.dateTo}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        year: null,
                        ...(i === 0
                          ? { dateFrom: e.target.value }
                          : { dateTo: e.target.value }),
                      })
                    }
                    style={{
                      fontFamily: "var(--font-mono-brand, monospace)",
                      fontSize: 11,
                      background: "transparent",
                      border: "1px solid #444",
                      color: "#f2ede4",
                      padding: "4px 8px",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => setShowDatePicker(false)}
                style={{
                  fontFamily: "var(--font-mono-brand, monospace)",
                  fontSize: 11,
                  fontWeight: 700,
                  background: "#1DB954",
                  color: "#000",
                  padding: "6px 12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [filters, setFiltersState] = useState<AppFilters>(DEFAULT_FILTERS)

  const setFilters = (f: AppFilters) => setFiltersState(f)
  const resetFilters = () => setFiltersState(DEFAULT_FILTERS)

  return (
    <AppFiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      <div className="flex h-screen overflow-hidden" style={{ background: "#f2ede4" }}>

        {/* ── Sidebar ── */}
        <aside
          className="flex w-16 flex-shrink-0 flex-col items-center gap-1 py-4"
          style={{ background: "#111", borderRight: "2px solid #1a1a1a" }}
        >
          {/* Logo */}
          <Link
            href="/dashboard"
            className="mb-4 flex h-9 w-9 items-center justify-center text-xs"
            style={{
              background: "#1DB954",
              fontFamily: "var(--font-mono-brand, monospace)",
              fontWeight: 900,
              color: "#000",
              letterSpacing: "-0.02em",
            }}
          >
            SS
          </Link>

          <NavIcon
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
          <NavIcon
            href="/all-artists"
            icon={<Users className="h-4 w-4" />}
            label="Artistes"
            active={pathname === "/all-artists"}
          />
          <NavIcon
            href="/all-music"
            icon={<Music className="h-4 w-4" />}
            label="Titres"
            active={pathname === "/all-music"}
          />

          <div className="my-1 w-8 border-t" style={{ borderColor: "#2a2a2a" }} />

          <NavIcon
            href="/dashboard?tab=import"
            icon={<Upload className="h-4 w-4" />}
            label="Importer CSV"
            active={false}
            accentIcon
          />

          <div className="flex-1" />

          {/* Logout */}
          <button
            onClick={() => router.push("/")}
            title="Déconnexion"
            className="mb-2 flex h-10 w-10 items-center justify-center border border-transparent transition-colors hover:border-[#333]"
            style={{ color: "#777", background: "none", cursor: "pointer" }}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>

      </div>
    </AppFiltersContext.Provider>
  )
}
