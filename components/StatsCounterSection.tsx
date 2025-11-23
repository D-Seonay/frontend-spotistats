"use client"

import { Card } from "@/components/ui/card"

type Props = {
  listeningMinutes: number
  topArtists: number
}

export default function StatsCounterSection({ listeningMinutes, topArtists }: Props) {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
              <p className="mb-2 text-5xl font-extrabold text-[#1DB954] md:text-6xl">
                {listeningMinutes.toLocaleString()}
              </p>
              <p className="text-lg text-gray-300">Minutes écoutées par nos utilisateurs</p>
            </Card>
            <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
              <p className="mb-2 text-5xl font-extrabold text-[#1DB954] md:text-6xl">{topArtists}+</p>
              <p className="text-lg text-gray-300">Artistes découverts cette semaine</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
