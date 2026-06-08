// components/Header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

type Props = {
  onLogin?: () => void
}

export default function Header({ onLogin }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
            <span className="font-mono text-lg font-bold text-black">SS</span>
          </div>
          <span className="hidden font-bold sm:inline">SpotiStats</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/dashboard" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Dashboard
          </Link>
          <Link href="/all-music" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Ma Musique
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button
            className="rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105"
            onClick={handleLogin}
          >
            Se connecter avec Spotify
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/dashboard"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/all-music"
              className="block text-gray-300 transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ma Musique
            </Link>
            <Button
              className="w-full rounded-full bg-[#1DB954] text-black font-semibold transition-all hover:bg-[#1ed760]"
              onClick={handleLogin}
            >
              Se connecter avec Spotify
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
