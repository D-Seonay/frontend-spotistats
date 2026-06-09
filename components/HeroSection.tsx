"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type Props = {
  onLogin: () => void
}

export default function HeroSection({ onLogin }: Props) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#f2ede4] border-b-4 border-black">
      {/* Décor flottant */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingImage className="left-[10%] top-[15%] h-32 w-32 rotate-[-12deg] md:h-40 md:w-40" src="/floatingImage/tate-mcrae.png" />
        <FloatingImage className="right-[15%] top-[20%] h-28 w-28 rotate-[8deg] md:h-36 md:w-36" src="/floatingImage/nessa-barrett.png" delay="1s" />
        <FloatingImage className="bottom-[25%] left-[8%] h-36 w-36 rotate-[15deg] md:h-44 md:w-44" src="/floatingImage/gazo.png" delay="2s" />
        <FloatingImage className="bottom-[30%] right-[12%] h-40 w-40 rotate-[-8deg] md:h-48 md:w-48" src="/floatingImage/the-weeknd.png" delay="1.5s" />
        <FloatingImage className="left-[15%] top-[45%] h-24 w-24 rotate-[20deg] md:h-32 md:w-32" src="/floatingImage/werenoi.png" delay="0.5s" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 
          className="mb-6 text-balance text-5xl md:text-7xl lg:text-[100px] font-black leading-[0.9] tracking-tighter text-black animate-slide-up"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Les stats Spotify qui donnent vie à ta musique.
        </h1>
        <p
          className="mb-8 text-balance text-lg text-gray-700 font-bold font-mono md:text-xl lg:text-2xl animate-slide-up"
          style={{ animationDelay: "0.1s", fontFamily: "var(--font-mono-brand)" }}
        >
          Découvre tes habitudes d'écoute, partage tes tendances, et accède en avant‑première aux insights exclusifs.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            size="lg"
            className="rounded-none bg-[#1DB954] px-8 py-6 text-lg font-black text-black uppercase tracking-wider border-4 border-black shadow-[8px_8px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_#000] transition-all"
            onClick={onLogin}
          >
            Se connecter avec Spotify
          </Button>
        </div>

        {/* Badges de confiance */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-black animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <IconRow text="Respect de ta vie privée" />
          <IconRow text="Connexion sécurisée via Spotify" />
        </div>
      </div>
    </section>
  )
}

/**
 * Ligne de badge + texte pour les trusts badges, alignée proprement.
 */
function IconRow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-none border-2 border-black bg-[#1DB954] text-black">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span className="align-middle font-bold font-mono uppercase tracking-tight">{text}</span>
    </div>
  )
}

function FloatingImage({
  src,
  className,
  delay = "0s",
}: {
  src: string
  className?: string
  delay?: string
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-none border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-gray-200 animate-float ${className ?? ""}`}
      style={{ animationDelay: delay, zIndex: 1 }}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  )
}
