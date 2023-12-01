'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'

import { routesConfig } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

import { SearchInput } from '../search-input'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full space-y-4">
        <MobileLink
          href="/food"
          className="flex shrink-0 items-center justify-center space-x-2"
          onOpenChange={setOpen}
        >
          <Icons.logo className="h-6 w-6" />
          <span className="inline-block font-bold">Food explorer</span>
        </MobileLink>

        <SearchInput onClose={setOpen} />

        <div className="flex flex-col space-y-3">
          {routesConfig.mainNav?.map(
            (item) =>
              item.href && (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  onOpenChange={setOpen}
                >
                  {item.title}
                </MobileLink>
              ),
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
