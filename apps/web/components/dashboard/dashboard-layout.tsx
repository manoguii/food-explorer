import * as React from 'react'

import { cn } from '@/lib/utils'

export function Dashboard({ children }: { children: React.ReactNode }) {
  return <div className="h-full">{children}</div>
}

Dashboard.Header = function DashboardHeader({
  heading,
  text,
  children,
}: {
  heading: string
  text?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-b bg-background py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center">
        <div className="grid">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {heading}
          </h1>
          {text && (
            <p className="text-sm text-muted-foreground sm:text-base">{text}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

Dashboard.Content = function DashboardContent({
  children,
  className,
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-6', className)}>
      {children}
    </div>
  )
}
