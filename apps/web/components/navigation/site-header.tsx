import { Logo } from '../logo'
import { ModeToggle } from '../mode-toggle'
import { OrdersModal } from '../orders-modal'
import { SearchInput } from '../search-input'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex justify-between px-6 py-3 md:hidden">
        <MobileNav />
        <Logo href="/food" />
        <OrdersModal />
      </div>

      <div className="hidden items-center justify-between px-6 py-3 md:flex">
        <MainNav />
        <div className="flex items-center gap-2">
          <SearchInput className="w-72 lg:w-80" />
          <ModeToggle />
          <OrdersModal />
        </div>
      </div>
    </header>
  )
}
