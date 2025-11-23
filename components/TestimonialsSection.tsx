"use client"

import { Card } from "@/components/ui/card"

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0a0a0a] to-black">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">Ce que disent nos utilisateurs</h2>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              name="Marie L."
              date="15 nov"
              avatar="/user-profile-illustration.png"
              text="Je viens de tester SLS, c'est dingue de voir mes moods d'écoute et mes tops évoluer chaque semaine. #MusicLovers"
              stats={{ comments: "12.5k", shares: "8.2k", likes: "34.1k" }}
              hover
            />
            <TestimonialCard
              name="Thomas B."
              date="22 nov"
              avatar="/diverse-person-smiling.png"
              text="Enfin une app qui comprend vraiment mes habitudes musicales ! Les insights sont ultra précis. 🎵"
              stats={{ comments: "8.7k", shares: "5.3k", likes: "28.9k" }}
              hover
            />
            <TestimonialCard
              name="Sofia R."
              date="1 déc"
              avatar="/happy-user.jpg"
              text="Les visualisations sont magnifiques et les comparaisons avec mes amis sont trop fun ! 🔥"
              stats={{ comments: "15.2k", shares: "11.8k", likes: "42.3k" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  name,
  date,
  avatar,
  text,
  stats,
  hover,
}: {
  name: string
  date: string
  avatar: string
  text: string
  stats: { comments: string; shares: string; likes: string }
  hover?: boolean
}) {
  return (
    <Card
      className={`group relative border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm ${
        hover ? "transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20" : ""
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#1DB954]">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-300">{text}</p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">💬 {stats.comments}</span>
        <span className="flex items-center gap-1">🔄 {stats.shares}</span>
        <span className="flex items-center gap-1">❤️ {stats.likes}</span>
      </div>
    </Card>
  )
}
