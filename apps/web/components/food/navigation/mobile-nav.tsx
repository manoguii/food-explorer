'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'

import { routesConfig } from '@/config/navigation'

import { Logo } from '../../logo'
import { SearchInput } from '../../search-input'
import { Button } from '../../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet'
import { NavigationItem } from './navigation-item'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full">
        <Logo
          href="/food"
          onClick={() => {
            setOpen(false)
          }}
        />

        <div className="mt-8 space-y-8">
          <SearchInput onClose={setOpen} />

          <nav className="flex flex-col space-y-3">
            {routesConfig.foodNav?.map((item) => (
              <NavigationItem
                key={item.href}
                href={item.href}
                title={item.title}
                onClick={() => {
                  setOpen(false)
                }}
              />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
