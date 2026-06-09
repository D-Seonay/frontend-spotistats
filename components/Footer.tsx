"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="mb-4 flex items-center justify-center gap-2 md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-black bg-[#1DB954] shadow-[2px_2px_0_0_#000]">
                <span className="font-mono text-lg font-black text-black">SS</span>
              </div>
              <span className="font-black uppercase tracking-tight text-black">SpotiStats</span>
            </Link>
            <p className="max-w-xs text-sm font-bold text-gray-700">Découvre, partage et possède tes stats d'écoute Spotify.</p>
          </div>

          <div className="text-center text-sm font-bold text-gray-700 md:text-right">
            <p>© 2025 SpotiStats. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
