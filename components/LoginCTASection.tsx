"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Music } from "lucide-react"

type Props = { onLogin: () => void }

export default function LoginCTASection({ onLogin }: Props) {
  return (
    <section id="spotify-login" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954] shadow-2xl shadow-[#1DB954]/40 animate-pulse-glow">
            <Music className="h-10 w-10 text-black" />
          </div>

          <h2 className="mb-6 text-balance text-3xl font-bold md:text-5xl">Découvre tes stats maintenant</h2>
          <p className="mb-8 text-balance text-lg text-gray-300">
            Connecte-toi avec ton compte Spotify en un clic et explore tes habitudes d'écoute comme jamais auparavant.
          </p>

          <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <Button
                size="lg"
                className="w-full rounded-full bg-[#1DB954] px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#1ed760] hover:shadow-2xl hover:shadow-[#1DB954]/50 flex items-center justify-center gap-3"
                onClick={onLogin}
              >
                <Music className="h-6 w-6" />
                Se connecter avec Spotify
              </Button>

              <div className="space-y-3 text-left text-sm text-gray-400">
                <Bullet text="Connexion 100% sécurisée via l'API officielle Spotify" />
                <Bullet text="Accès en lecture seule à tes statistiques d'écoute" />
                <Bullet text="Aucun accès à ton mot de passe ou informations de paiement" />
                <Bullet text="Révoque l'accès à tout moment depuis ton compte Spotify" />
              </div>
            </div>
          </Card>

          <p className="mt-6 text-sm text-gray-500">
            En te connectant, tu acceptes nos{" "}
            <a href="#" className="text-[#1DB954] hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-[#1DB954] hover:underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
      <span>{text}</span>
    </div>
  )
}
