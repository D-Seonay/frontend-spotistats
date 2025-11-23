"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2 } from "lucide-react"

export default function DataOwnershipSection() {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold md:text-5xl">Possède tes données d'écoute</h2>
          <p className="mb-12 text-balance text-lg text-gray-300">
            Tu contrôles tes infos. Import simple, export facile, suppression à tout moment.
          </p>

          <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm">
            <div className="space-y-4">
              <DataRow title="Top 50 Morceaux de 2024" subtitle="Généré le 15 déc 2024" />
              <DataRow title="Historique d'écoute complet" subtitle="Toutes tes données" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function DataRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-800/50 p-4 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-zinc-800/70">
      <div className="text-left">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
