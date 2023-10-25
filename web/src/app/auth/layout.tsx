import { Icons } from '@/components/icons'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid h-screen items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="grid place-content-center place-items-center bg-gray-950 p-2 text-white md:p-10 lg:flex">
        <div className="flex items-center gap-5">
          <Icons.logo />
          <h1 className="text-3xl font-bold md:text-4xl">Food Explorer</h1>
        </div>
      </div>

      {children}
    </div>
  )
}
