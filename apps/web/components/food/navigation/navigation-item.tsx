import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

type NavigationItemProps = LinkProps &
  React.HtmlHTMLAttributes<HTMLAnchorElement> & {
    title: string
  }

export function NavigationItem({
  className,
  href,
  title,
  ...rest
}: NavigationItemProps) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-foreground',
        pathname === href ? 'text-foreground' : 'text-foreground/60',
        className,
      )}
      {...rest}
    >
      {title}
    </Link>
  )
}
