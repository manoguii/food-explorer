import { Icons } from '@/components/icons'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative grid h-full flex-col place-content-center place-items-center bg-gray-950 p-10 text-white dark:border-r lg:flex">
          <div className="flex items-center gap-5">
            <Icons.logo />
            <h1 className="text-4xl font-bold">Food Explorer</h1>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
