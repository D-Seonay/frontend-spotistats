"use client"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
                <span className="font-mono text-lg font-bold text-black">SLS</span>
              </div>
              <span className="font-bold">Spotify Listener Stats</span>
            </div>
            <p className="text-sm text-gray-400">Découvre, partage et possède tes stats d'écoute Spotify.</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Produit</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Entreprise</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Carrières
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Conditions
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#1DB954]">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Spotify Listener Stats. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
