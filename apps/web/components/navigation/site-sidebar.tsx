"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { routesConfig } from "@/config/navigation"
import { User } from "@/lib/types/definitions"
import { cn } from "@/lib/utils"

import { Icons } from "../icons"
import { UserAccountNav } from "./user-nav"

export function SiteSidebar({ user }: { user: User }) {
  const path = usePathname()

  if (!routesConfig.sidebarNav?.length) {
    return null
  }

  return (
    <aside className="relative hidden w-[200px] flex-col md:flex">
      <div className="fixed grid h-[calc(100vh-10%)] w-[200px] grid-rows-[max-content_max-content_1fr]">
        <Link href="/food" className="mb-6 items-center space-x-2 md:flex">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold sm:inline-block">Food explorer</span>
        </Link>

        <nav className="mb-6 grid items-start gap-2">
          {routesConfig.sidebarNav.map((item, index) => {
            const Icon = item.icon || "arrowRight"
            return (
              item.href && (
                <Link key={index} href={item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href ? "bg-accent" : "transparent"
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

        <div className="mt-auto flex items-center justify-start gap-2">
          <UserAccountNav user={user} />
          <div className="flex flex-col space-y-1 text-xs leading-none">
            {user.name && (
              <p className="w-[140px] truncate font-medium">{user.name}</p>
            )}
            {user.email && (
              <p className="w-[140px] truncate text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
