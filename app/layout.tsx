import type React from "react"
import type { Metadata } from "next"
import { Unbounded, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { DataProvider } from "@/lib/DataContext"

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono-brand",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Spotify Listener Stats - Tes stats Spotify réinventées",
  description:
    "Découvre tes habitudes d'écoute, partage tes tendances, et accède en avant‑première aux insights exclusifs. Rejoins la bêta privée.",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${unbounded.variable} ${spaceMono.variable} font-sans antialiased`}>
        <DataProvider>{children}</DataProvider>
        <Analytics />
      </body>
    </html>
  )
}
