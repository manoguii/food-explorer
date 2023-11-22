'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { routesConfig } from '@/config/navigation'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 gap-2 px-0 text-base font-medium hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.logo className="h-5 w-5" />
          <span>Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">Food Explorer</span>
        </MobileLink>

        <ScrollArea className="my-4 h-[50vh] pb-10">
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
        </ScrollArea>
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
