"use client"

import { Button } from "@/components/ui/button"
import { Lock, Music, TrendingUp } from "lucide-react"

type Props = { onLogin: () => void }

export default function FeatureCards({ onLogin }: Props) {
  return (
    <section id="fonctionnalites" className="py-16 md:py-24 bg-white border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black border-y-4 border-black border-l-0 border-r-0">
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
                className="mt-4 rounded-none border-4 border-black bg-[#1DB954] px-8 py-6 text-base font-black uppercase tracking-wider text-black shadow-[4px_4px_0_0_#000] transition-all hover:bg-[#1ed760] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
                onClick={onLogin}
                style={{ fontFamily: "var(--font-mono-brand)" }}
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
    <div className="group relative bg-[#f2ede4] p-10 transition-colors hover:bg-white flex flex-col h-full">
      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center border-4 border-black bg-[#1DB954] shadow-[4px_4px_0_0_#000]">
        {icon}
      </div>
      <h3 className="mb-4 text-2xl font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="mb-8 text-base font-medium text-gray-700 font-mono" style={{ fontFamily: "var(--font-mono-brand)" }}>
        {description}
      </p>
      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  )
}
