import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import React from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
