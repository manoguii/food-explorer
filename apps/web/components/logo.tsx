import Link, { LinkProps } from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

import { Icons } from './icons'

type LogoProps = LinkProps &
  React.HtmlHTMLAttributes<HTMLAnchorElement> & {
    responsive?: boolean
  }

export function Logo({
  responsive = false,
  className,
  href,
  ...rest
}: LogoProps) {
  return (
    <Link
      href={href ?? '/food'}
      className={cn(
        'flex shrink-0 items-center justify-center space-x-2',
        className,
      )}
      {...rest}
    >
      <Icons.logo className="h-6 w-6" />
      <span
        className={cn('inline-block font-bold', {
          'hidden lg:inline-block': responsive,
        })}
      >
        Food explorer
      </span>
    </Link>
  )
}
