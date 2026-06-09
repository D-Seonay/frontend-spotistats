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
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
            <span className="font-mono text-lg font-bold text-black">SS</span>
          </div>
          <span className="hidden font-bold sm:inline text-black">SpotiStats</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/dashboard" className="text-sm text-black font-bold transition-colors hover:text-[#1DB954]">
            Dashboard
          </Link>
          <Link href="/all-music" className="text-sm text-black font-bold transition-colors hover:text-[#1DB954]">
            Ma Musique
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button
            className="rounded-none bg-[#1DB954] px-6 py-6 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all"
            onClick={handleLogin}
          >
            Se connecter avec Spotify
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-4 border-black">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/dashboard"
              className="block text-black font-bold transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/all-music"
              className="block text-black font-bold transition-colors hover:text-[#1DB954]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ma Musique
            </Link>
            <Button
              className="w-full rounded-none bg-[#1DB954] px-6 py-6 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all"
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
