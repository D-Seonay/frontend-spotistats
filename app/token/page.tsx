"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TokenPage() {
  const [token, setToken] = useState("")

  const saveToken = () => {
    localStorage.setItem("spotify_access_token", token)
    alert("Token saved!")
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center">Set Spotify Token</h1>
          <p className="text-center text-gray-400 mt-2">
            Get a temporary token from{" "}
            <a
              href="https://developer.spotify.com/console/get-current-user/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1DB954] hover:underline"
            >
              Spotify for Developers Console
            </a>
            .
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Paste your token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#1DB954] focus:outline-none"
          />
          <Button onClick={saveToken} className="w-full bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760]">
            Save Token
          </Button>
        </div>
        <div className="text-center">
          <Link href="/profile">
            <span className="text-[#1DB954] hover:underline">Go to Profile Page</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
