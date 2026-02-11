// lib/spotify.ts

const SPOTIFY_API_BASE = "https://api.spotify.com/v1"

async function getAccessToken(): Promise<string | null> {
  // First, try to get the token from the client-side API endpoint
  const response = await fetch("/api/auth/token")
  if (response.ok) {
    const data = await response.json()
    return data.access_token
  }

  // If that fails, try to refresh the token
  const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" })
  if (refreshResponse.ok) {
    const data = await refreshResponse.json()
    // The cookie is updated by the refresh endpoint, so we can try to get it again
    const newTokenResponse = await fetch("/api/auth/token")
    if (newTokenResponse.ok) {
      const newTokenData = await newTokenResponse.json()
      return newTokenData.access_token
    }
  }

  return null
}

async function spotifyFetch(endpoint: string, method: string = "GET", body?: any): Promise<any> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    console.error("No Spotify access token available.")
    return null
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, config)

  if (response.status === 401) {
    // Access token expired or invalid, try to refresh and retry
    const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" })
    if (refreshResponse.ok) {
      const newAccessToken = await getAccessToken()
      if (newAccessToken) {
        // Retry the original request with the new token
        headers.Authorization = `Bearer ${newAccessToken}`
        const retryResponse = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, config)
        if (retryResponse.ok) {
          return retryResponse.json()
        }
      }
    }
    // If refresh failed or retrying the request failed
    console.error("Failed to refresh token or retry request.")
    return null
  }

  if (!response.ok) {
    console.error(`Spotify API error: ${response.status} ${response.statusText}`)
    return null
  }

  return response.json()
}

export async function searchSpotify(query: string, type: "track" | "artist", limit: number = 1): Promise<any> {
  return spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`)
}
