// app/spotify-listener-stats/page.tsx
"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeatureCards from "@/components/FeatureCards"
import LoginCTASection from "@/components/LoginCTASection"
import Footer from "@/components/Footer"

export default function SpotifyListenerStatsPage() {
  const handleSpotifyLogin = () => {
    // IMPORTANT: Rediriger vers une route serveur qui initie l'OAuth Spotify
    // Évite de mettre directement une URL externe ici si tu dois ajouter state/PKCE.
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-[#f2ede4] text-[#111]">
      <Header
        onLogin={handleSpotifyLogin}
      />

      <HeroSection onLogin={handleSpotifyLogin} />

      <FeatureCards onLogin={handleSpotifyLogin} />

      <LoginCTASection onLogin={handleSpotifyLogin} />

      <Footer />
    </div>
  )
}
