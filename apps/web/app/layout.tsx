import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import React from "react"

import { Toaster } from "@/components/ui/toaster"

import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Food Explorer",
    template: "%s | Food Explorer",
  },
  description: "O seu restaurante favorito está aqui.",
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
        <Toaster />
      </body>
    </html>
  )
}
