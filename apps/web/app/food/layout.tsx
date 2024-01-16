import React from 'react'

import { SiteHeader } from '@/components/food/navigation/site-header'
import { Footer } from '@/components/footer'

export default async function FoodLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[max-content_1fr_max-content]">
      <SiteHeader />
      <div className="mx-auto h-full w-full max-w-7xl px-4 py-6">
        {children}
      </div>
      <Footer />
    </div>
  )
}
