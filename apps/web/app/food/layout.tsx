import { auth } from '@/auth'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/header/mobile-nav'
import { ModeToggle } from '@/components/header/mode-toggle'
import { DashboardNav } from '@/components/header/nav'
import { UserAccountNav } from '@/components/header/user-nav'
import { Icons } from '@/components/icons'
import { OrdersModal } from '@/components/order/orders-modal'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    return notFound()
  }

  const { user } = session

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link
              href="/food"
              className="mr-6 hidden items-center space-x-2 md:flex"
            >
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold sm:inline-block">Food explorer</span>
            </Link>

            <MobileNav />
          </div>

          <nav className="flex items-center gap-2">
            <ModeToggle />
            <OrdersModal />
            <UserAccountNav
              user={{
                name: user.name,
                image: 'https://github.com/manoguii.png',
                email: user.email,
              }}
            />
          </nav>
        </div>
      </header>
      <div className="container grid flex-1 gap-4 md:grid-cols-[200px_1fr]">
        <aside className="relative hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden px-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
