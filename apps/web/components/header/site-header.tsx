import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { ModeToggle } from './mode-toggle'
import { OrdersModal } from '../order/orders-modal'
import { SignOutButton } from '../buttons/sign-out'
import { UserNav } from './user-nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full items-center px-6">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Input de pesquisa ou modal */}
          </div>

          <nav className="flex items-center gap-2">
            <SignOutButton />
            <ModeToggle />
            <OrdersModal />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
