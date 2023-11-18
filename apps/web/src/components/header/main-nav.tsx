'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/food" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Food explorer</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/food/dish/favorites"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/food/dish/favorites'
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Meus favoritos
        </Link>
        <Link
          href="/food/orders"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/food/orders')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Histórico de pedidos
        </Link>
        <Link
          href="food/dish/create"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('food/dish/create')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Novo prato
        </Link>
      </nav>
    </div>
  )
}
