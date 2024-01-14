'use client'

import * as React from 'react'

import { routesConfig } from '@/config/navigation'

import { Logo } from '../../logo'
import { NavigationItem } from './navigation-item'

export function MainNav() {
  return (
    <div className="hidden gap-6 md:flex">
      <Logo href="/food" responsive />

      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routesConfig.foodNav.map((route) => {
          return (
            <NavigationItem
              key={route.href}
              href={route.href}
              title={route.title}
            />
          )
        })}
      </nav>
    </div>
  )
}
