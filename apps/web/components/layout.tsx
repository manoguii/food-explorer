import * as React from 'react'

import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col gap-6">{children}</div>
}

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

Layout.Title = function LayoutTitle({
  children,
  className,
  ...rest
}: TitleProps) {
  return (
    <h1 className={cn('text-2xl font-semibold', className)} {...rest}>
      {children}
    </h1>
  )
}

Layout.Header = function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center">
      <div className="grid">
        <h1 className="text-2xl font-medium leading-tight md:text-3xl">
          {heading}
        </h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
