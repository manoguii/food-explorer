import { cn } from '@/lib/utils'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { Icons } from '../icons'

export function ButtonLinkAdmin() {
  return (
    <Link
      href="/dashboard/dish/new"
      className={cn(
        buttonVariants({
          variant: 'destructive',
        }),
        'flex items-center gap-2 px-8 py-3',
      )}
    >
      Novo prato
    </Link>
  )
}

export function ButtonLink() {
  return (
    <Link
      href="/dashboard/dish/new"
      className={cn(
        buttonVariants({
          variant: 'destructive',
        }),
        'flex items-center gap-2 px-8 py-3',
      )}
    >
      <Icons.receipt className="h-5 w-5" />
      Pedidos (0)
    </Link>
  )
}
