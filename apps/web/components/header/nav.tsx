'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { routesConfig } from '@/config/navigation'

export function DashboardNav() {
  const path = usePathname()

  if (!routesConfig.sidebarNav?.length) {
    return null
  }

  return (
    <nav className="fixed grid w-[200px] items-start gap-2">
      {routesConfig.sidebarNav.map((item, index) => {
        const Icon = item.icon || 'arrowRight'
        return (
          item.href && (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  path === item.href ? 'bg-accent' : 'transparent',
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
