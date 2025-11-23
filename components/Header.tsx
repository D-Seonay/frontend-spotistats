"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

type Props = {
  mobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  onLogin: () => void
}

export default function Header({ mobileMenuOpen, onToggleMobileMenu, onLogin }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
            <span className="font-mono text-lg font-bold text-black">SLS</span>
          </div>
          <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#auditeurs" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Pour les auditeurs
          </a>
          <a href="#fonctionnalites" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Fonctionnalités
          </a>
          <a href="#partenaires" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Partenaires
          </a>
          <a href="#apropos" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            À propos
          </a>
          <a href="#contact" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="hidden rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105 md:inline-flex"
            onClick={onLogin}
          >
            Se connecter avec Spotify
          </Button>
          <button className="md:hidden" onClick={onToggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black/95 p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#auditeurs" className="text-sm text-gray-300 hover:text-[#1DB954]">
              Pour les auditeurs
            </a>
            <a href="#fonctionnalites" className="text-sm text-gray-300 hover:text-[#1DB954]">
              Fonctionnalités
            </a>
            <a href="#partenaires" className="text-sm text-gray-300 hover:text-[#1DB954]">
              Partenaires
            </a>
            <a href="#apropos" className="text-sm text-gray-300 hover:text-[#1DB954]">
              À propos
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-[#1DB954]">
              Contact
            </a>
            <Button
              className="w-full rounded-full bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760]"
              onClick={onLogin}
            >
              Se connecter avec Spotify
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
