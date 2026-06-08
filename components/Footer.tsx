"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="mb-4 flex items-center justify-center gap-2 md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
                <span className="font-mono text-lg font-bold text-black">SS</span>
              </div>
              <span className="font-bold">SpotiStats</span>
            </Link>
            <p className="max-w-xs text-sm text-gray-400">Découvre, partage et possède tes stats d'écoute Spotify.</p>
          </div>

          <div className="text-center text-sm text-gray-400 md:text-right">
            <p>© 2025 SpotiStats. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
