import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
