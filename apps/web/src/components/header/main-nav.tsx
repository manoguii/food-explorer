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
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Food explorer</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/favorite-dishes"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/favorite-dishes'
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Meus favoritos
        </Link>
        <Link
          href="/orders"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/orders')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Histórico de pedidos
        </Link>
        <Link
          href="/dish/new"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/dish/new')
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
