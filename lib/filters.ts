import { SpotifyStreamingData } from "@/lib/types"

export interface AppFilters {
  year: string | null
  dateFrom: string
  dateTo: string
  artistName: string
  trackName: string
}

export const DEFAULT_FILTERS: AppFilters = {
  year: null,
  dateFrom: "",
  dateTo: "",
  artistName: "",
  trackName: "",
}

export function applyAppFilters(
  data: SpotifyStreamingData[],
  filters: AppFilters,
): SpotifyStreamingData[] {
  return data.filter((item) => {
    // Year filter (only if no custom date range overrides it)
    if (filters.year && !filters.dateFrom && !filters.dateTo) {
      if (!item.endTime.startsWith(filters.year)) return false
    }
    if (filters.dateFrom) {
      if (new Date(item.endTime) < new Date(filters.dateFrom)) return false
    }
    if (filters.dateTo) {
      if (new Date(item.endTime) > new Date(filters.dateTo + "T23:59:59")) return false
    }
    if (
      filters.artistName &&
      !item.artistName.toLowerCase().includes(filters.artistName.toLowerCase())
    ) {
      return false
    }
    if (
      filters.trackName &&
      !item.trackName.toLowerCase().includes(filters.trackName.toLowerCase())
    ) {
      return false
    }
    return true
  })
}
