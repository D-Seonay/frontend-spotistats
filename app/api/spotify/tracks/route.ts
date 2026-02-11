import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    let accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 })
    }

    let allTracks: any[] = []
    let nextUrl: string | null = "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term"

    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 401) {
        // Access token expired, try to refresh
        const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
          method: "POST",
        })

        if (!refreshResponse.ok) {
          return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 })
        }

        const refreshData = await refreshResponse.json()
        accessToken = cookieStore.get("spotify_access_token")?.value // Get the new access token

        if (!accessToken) {
          return NextResponse.json({ error: "No new access token after refresh" }, { status: 401 })
        }

        // Retry the original request with the new token
        const retryResponse = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!retryResponse.ok) {
          return NextResponse.json({ error: "Failed to fetch tracks after token refresh" }, { status: retryResponse.status })
        }
        const data = await retryResponse.json();
        allTracks = allTracks.concat(data.items);
        nextUrl = data.next;
      } else if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch tracks from Spotify API", details: await response.text() }, { status: response.status })
      } else {
        const data = await response.json()
        allTracks = allTracks.concat(data.items)
        nextUrl = data.next
      }
    }

    return NextResponse.json(allTracks)
  } catch (error) {
    console.error("[v0] Error fetching all tracks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
