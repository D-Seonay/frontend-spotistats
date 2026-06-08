import { useMemo } from "react"

export function ActivityHeatmap({ data }: { data: { date: string; minutes: number; streams: number }[] }) {
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

  const getIntensity = (minutes: number) => {
    if (minutes === 0) return "bg-white/5"
    const ratio = minutes / maxMinutes
    if (ratio < 0.25) return "bg-[#1DB954]/30"
    if (ratio < 0.5) return "bg-[#1DB954]/50"
    if (ratio < 0.75) return "bg-[#1DB954]/70"
    return "bg-[#1DB954]"
  }

  const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  if (weeks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Aucune donnée disponible pour la heatmap
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 pr-2 text-xs text-gray-500">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-3 leading-3">
              {i % 2 === 1 ? day : ""}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`group relative h-3 w-3 rounded-sm transition-all hover:ring-1 hover:ring-white/50 ${
                    day.date ? getIntensity(day.minutes) : "bg-transparent"
                  }`}
                >
                  {day.date && day.minutes > 0 && (
                    <div className="pointer-events-none absolute -top-12 left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs group-hover:block">
                      <p className="font-medium">{day.date}</p>
                      <p className="text-gray-400">
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
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Moins</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-white/5" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/30" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/50" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/70" />
          <div className="h-3 w-3 rounded-sm bg-[#1DB954]" />
        </div>
        <span>Plus</span>
      </div>
    </div>
  )
}
