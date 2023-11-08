import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import React from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col justify-between">
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-12 px-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
