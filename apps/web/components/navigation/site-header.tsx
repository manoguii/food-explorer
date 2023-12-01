import Link from 'next/link'

import { Icons } from '../icons'
import { OrdersModal } from '../orders-modal'
import { SearchInput } from '../search-input'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/90">
      <div className="flex justify-between px-6 py-3 md:hidden">
        <MobileNav />
        <Link
          href="/food"
          className="flex shrink-0 items-center justify-center space-x-2"
        >
          <Icons.logo className="h-6 w-6" />
          <span className="inline-block font-bold">Food explorer</span>
        </Link>
        <OrdersModal />
      </div>

      <div className="hidden grid-cols-3 px-6 py-3 md:grid">
        <MainNav />
        <SearchInput />
        <OrdersModal />
      </div>
    </header>
  )
}
