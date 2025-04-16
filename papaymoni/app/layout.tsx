import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { Providers } from "@/components/providers"

// Configure the Inter font with a proper subset to avoid loading issues
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Papay Moni - P2P Cryptocurrency Trading Platform",
  description: "Automated peer-to-peer cryptocurrency trading platform for seamless asset buying and selling",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
