import { cn } from '@/lib/utils'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { Icons } from '../icons'

export function FavoriteDish() {
  return (
    <Link
      href="/dashboard/favorite-dishes"
      className={buttonVariants({
        variant: 'link',
      })}
    >
      Pratos favoritos
    </Link>
  )
}

export function NewDish() {
  return (
    <Link
      href="/dashboard/dish/new"
      className={cn(
        buttonVariants({
          variant: 'link',
        }),
      )}
    >
      Novo prato
    </Link>
  )
}

export function OrderButton() {
  return (
    <Link
      href="/dashboard/orders"
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
