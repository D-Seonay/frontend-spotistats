import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 })
    }

    return NextResponse.json({ access_token: accessToken })
  } catch (error) {
    console.error("[v0] Token retrieval error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
