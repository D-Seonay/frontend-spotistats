"use client"

import { Card } from "@/components/ui/card"
import { Clock, Music } from "lucide-react"

type Props = {
  listeningMinutes: number
  topArtists: number
}

export default function PreviewSection({ listeningMinutes, topArtists }: Props) {
  return (
    <section id="apercu" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">Aperçu interactif</h2>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Card className="border-cyan-[#1DB954]/30 bg-[#1DB954]/20 p-8 backdrop-blur-sm">
            <Clock className="mb-4 h-12 w-12 text-[#1DB954]" />
            <p className="mb-2 text-sm text-gray-400">Minutes d'écoute totales</p>
            <p className="text-5xl font-bold text-[#1DB954]">{listeningMinutes.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-300">Ce mois-ci</p>
          </Card>

          <Card className="border-orange-[#1DB954]/30 bg-[#1DB954]/20 p-8 backdrop-blur-sm">
            <Music className="mb-4 h-12 w-12 text-[#1DB954]" />
            <p className="mb-2 text-sm text-gray-400">Artistes découverts</p>
            <p className="text-5xl font-bold text-[#1DB954]">{topArtists}</p>
            <p className="mt-2 text-sm text-gray-300">Cette année</p>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-300">Et ce n'est qu'un aperçu de ce que tu pourras découvrir avec SLS.</p>
        </div>
      </div>
    </section>
  )
}
