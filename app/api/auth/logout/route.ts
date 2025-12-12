import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })

    // Clear authentication cookies
    response.cookies.delete("spotify_access_token")
    response.cookies.delete("spotify_refresh_token")

    return response
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
