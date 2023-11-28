import React from "react"

import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/navigation/site-header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 grid-rows-[max-content_1fr_max-content]">
      <SiteHeader />

      <div className="mx-auto min-h-[calc(100vh-72px-40px)] w-full max-w-7xl space-y-12 px-4 py-6">
        {children}
      </div>
      <Footer />
    </div>
  )
}
