import { useMemo } from "react"

export function ActivityHeatmap({
  data,
}: {
  data: { date: string; minutes: number; streams: number }[]
}) {
  const weeks = useMemo(() => {
    if (!data || data.length === 0) return []

    const dataMap = new Map(data.map((d) => [d.date, d]))
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 364)

    const allDays: { date: string; minutes: number; streams: number; weekday: number }[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0]
      const existing = dataMap.get(dateStr)
      allDays.push({
        date: dateStr,
        minutes: existing?.minutes || 0,
        streams: existing?.streams || 0,
        weekday: current.getDay(),
      })
      current.setDate(current.getDate() + 1)
    }

    const weeksArray: (typeof allDays)[] = []
    let currentWeek: typeof allDays = []

    allDays.forEach((day, index) => {
      if (index === 0) {
        for (let i = 0; i < day.weekday; i++) {
          currentWeek.push({ date: "", minutes: 0, streams: 0, weekday: i })
        }
      }
      currentWeek.push(day)
      if (day.weekday === 6 || index === allDays.length - 1) {
        weeksArray.push(currentWeek)
        currentWeek = []
      }
    })

    return weeksArray
  }, [data])

  const maxMinutes = useMemo(() => {
    if (!data || data.length === 0) return 1
    return Math.max(...data.map((d) => d.minutes), 1)
  }, [data])

  const getColor = (minutes: number): string => {
    if (minutes === 0) return "#ece8e0"
    const ratio = minutes / maxMinutes
    if (ratio < 0.25) return "#a8dfbf"
    if (ratio < 0.5) return "#6dca96"
    if (ratio < 0.75) return "#3db56d"
    return "#1DB954"
  }

  const dayLabels = ["D", "L", "M", "M", "J", "V", "S"]

  if (weeks.length === 0) {
    return (
      <div
        className="flex h-24 items-center justify-center"
        style={{ fontFamily: "var(--font-mono-brand)", fontSize: 12, color: "#888" }}
      >
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 4, width: "max-content" }}>
          {/* Day labels column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingRight: 6 }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  width: 13,
                  height: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  fontFamily: "var(--font-mono-brand)",
                  fontSize: 9,
                  color: "#888",
                  lineHeight: 1,
                }}
              >
                {i % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="group relative"
                  style={{
                    width: 13,
                    height: 13,
                    flexShrink: 0,
                    background: day.date ? getColor(day.minutes) : "transparent",
                    cursor: day.date && day.minutes > 0 ? "pointer" : "default",
                  }}
                >
                  {day.date && day.minutes > 0 && (
                    <div
                      className="pointer-events-none absolute z-50 hidden group-hover:block"
                      style={{
                        bottom: "calc(100% + 4px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#111",
                        padding: "6px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-mono-brand)",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#f2ede4",
                        }}
                      >
                        {day.date}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-mono-brand)",
                          fontSize: 10,
                          color: "#aaa",
                        }}
                      >
                        {day.minutes} min · {day.streams} écoutes
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 10,
            color: "#666",
          }}
        >
          Moins
        </span>
        {["#ece8e0", "#a8dfbf", "#6dca96", "#3db56d", "#1DB954"].map((color) => (
          <div key={color} style={{ width: 13, height: 13, background: color, flexShrink: 0 }} />
        ))}
        <span
          style={{
            fontFamily: "var(--font-mono-brand)",
            fontSize: 10,
            color: "#666",
          }}
        >
          Plus
        </span>
      </div>
    </div>
  )
}
