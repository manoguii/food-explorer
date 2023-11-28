"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { routesConfig } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/food" className="mr-4 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">Food explorer</span>
      </Link>

      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routesConfig.mainNav.map((route) => {
          return (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === route.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {route.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
