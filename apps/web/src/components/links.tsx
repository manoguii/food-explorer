import { cn } from '@/lib/utils'
import Link from 'next/link'
import { buttonVariants } from './ui/button'

export function FavoriteDish() {
  return (
    <Link
      href="/favorite-dishes"
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
      href="/dish/new"
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

export function EditDish(slug: string) {
  return (
    <Link
      href={`/dish/${slug}/update`}
      className={buttonVariants({
        variant: 'destructive',
      })}
    >
      Editar prato
    </Link>
  )
}
