"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Music } from "lucide-react"

type Props = { onLogin: () => void }

export default function LoginCTASection({ onLogin }: Props) {
  return (
    <section id="spotify-login" className="py-16 md:py-24 bg-[#f2ede4] border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-[#1DB954] shadow-[4px_4px_0_0_#000] animate-pulse-glow">
            <Music className="h-10 w-10 text-black" />
          </div>

          <h2 className="mb-6 text-balance text-3xl font-black uppercase tracking-tight md:text-5xl text-black">Découvre tes stats maintenant</h2>
          <p className="mb-8 text-balance text-lg font-bold font-mono text-gray-700">
            Connecte-toi avec ton compte Spotify en un clic et explore tes habitudes d'écoute comme jamais auparavant.
          </p>

          <Card className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0_0_#000] p-8">
            <div className="space-y-6">
              <Button
                size="lg"
                className="w-full rounded-none border-2 border-black bg-[#1DB954] px-8 py-6 text-lg font-black uppercase tracking-tight text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#1ed760] hover:shadow-none shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-3"
                onClick={onLogin}
              >
                <Music className="h-6 w-6" />
                Se connecter avec Spotify
              </Button>

              <div className="space-y-3 text-left text-sm font-bold text-gray-700">
                <Bullet text="Connexion 100% sécurisée via l'API officielle Spotify" />
                <Bullet text="Accès en lecture seule à tes statistiques d'écoute" />
                <Bullet text="Aucun accès à ton mot de passe ou informations de paiement" />
                <Bullet text="Révoque l'accès à tout moment depuis ton compte Spotify" />
              </div>
            </div>
          </Card>

          <p className="mt-6 text-sm font-bold text-gray-600">
            En te connectant, tu acceptes nos{" "}
            <a href="#" className="text-black underline decoration-2 underline-offset-2 hover:text-[#1DB954]">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-black underline decoration-2 underline-offset-2 hover:text-[#1DB954]">
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
      <span className="text-gray-700">{text}</span>
    </div>
  )
}
