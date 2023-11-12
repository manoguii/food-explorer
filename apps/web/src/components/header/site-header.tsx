import { cn } from '@/lib/utils'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'
import { Button } from '../ui/button'
import { ModeToggle } from './mode-toggle'
import { OrderButton, SignOutButton } from './buttons'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full items-center px-3">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Input de pesquisa */}
            <Button
              variant="outline"
              className={cn(
                'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
              )}
            >
              <span className="hidden lg:inline-flex">
                Search documentation...
              </span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          <nav className="flex items-center gap-1.5">
            <OrderButton />
            <SignOutButton />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
