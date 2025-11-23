"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, Music, TrendingUp } from "lucide-react"

type Props = { onLogin: () => void }

export default function FeatureCards({ onLogin }: Props) {
  return (
    <section id="fonctionnalites" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Music className="h-7 w-7 text-black" />}
            title="Connecter & Explorer"
            description="Connecte ton compte Spotify en un clic et explore tes stats en temps réel."
          />
          <FeatureCard
            icon={<TrendingUp className="h-7 w-7 text-black" />}
            title="Curater ton expérience"
            description="Crée des résumés personnalisés par mood, genre, période, et partage des visualisations."
          />
          <FeatureCard
            icon={<Lock className="h-7 w-7 text-black" />}
            title="Débloquer des insights exclusifs"
            description="Accède à des comparaisons avancées, des tendances hebdo, et des drops bêta."
            footer={
              <Button
                className="mt-4 rounded-full bg-[#1DB954] text-black font-semibold transition-all duration-300 hover:bg-[#1ed760] hover:scale-105 hover:shadow-lg hover:shadow-[#1DB954]/30"
                onClick={onLogin}
              >
                Créer un compte
              </Button>
            }
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  footer,
}: {
  icon: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
}) {
  return (
    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB954] shadow-lg transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-bold">{title}</h3>
        <p className="mb-6 text-gray-300">{description}</p>
        {footer}
      </div>
    </Card>
  )
}
