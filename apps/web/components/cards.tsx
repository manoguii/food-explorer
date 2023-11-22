import clsx from 'clsx'
import Image from 'next/image'
import { Dish } from '@/lib/types/definitions'
import Label from './label'
import { FavoriteButton } from './buttons/favorite-button'

export function DishCard({
  isInteractive = true,
  active,
  dish,
}: {
  isInteractive?: boolean
  active?: boolean
  dish: Dish
}) {
  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:!border-blue-600 dark:bg-gray-950',
        {
          'border-2 border-blue-600': active,
          'border-gray-200 dark:border-gray-800': !active,
        },
      )}
    >
      <Image
        className={clsx('relative h-full w-full object-cover', {
          'transition duration-300 ease-in-out group-hover:scale-105':
            isInteractive,
        })}
        alt={dish.description}
        src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${dish.attachments[0].url}`}
        fill
        quality={100}
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
      />

      <Label
        title={dish.name}
        amount={dish.price.toString()}
        currencyCode="BRL"
        position="bottom"
      />

      <FavoriteButton
        dishId={dish.id}
        favorite={dish.isFavorite || false}
        className="absolute right-3 top-3 z-10"
      />
    </div>
  )
}
