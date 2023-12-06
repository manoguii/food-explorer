import Image from 'next/image'
import Link from 'next/link'

import { Dish } from '@/lib/types/definitions'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { DishOperations } from '@/components/dish-operations'

import { AddToCart } from './buttons/add-to-cart'
import { FavoriteButton } from './buttons/favorite-button'
import Price from './price'
import { Badge } from './ui/badge'

interface DishItemProps {
  dish: Dish
}

export function DishCard({
  dish,
  favoriteCard,
}: {
  dish: Dish
  favoriteCard?: boolean
}) {
  return (
    <div className=" group relative flex h-full w-full flex-col justify-between">
      <Link
        href={`/food/dish/${dish.slug}`}
        className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-white hover:!border-gray-700 dark:bg-gray-950"
      >
        <Image
          className="aspect-video h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-80"
          alt={dish.description}
          src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${dish.attachments[0].url}`}
          fill
          quality={100}
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
        />
      </Link>

      <div>
        <Link href={`/food/dish/${dish.slug}`} className="flex gap-2">
          <h4 className="text-lg font-semibold leading-tight">{dish.name}</h4>

          <Price
            className="ml-auto font-normal text-secondary-foreground"
            amount={dish.price.toString()}
            currencyCode="BRL"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </Link>

        <p className="w-full truncate text-sm text-muted-foreground">
          {dish.description}
        </p>
      </div>

      <div className="mb-4 mt-2 flex flex-wrap items-center gap-1">
        {dish.ingredients.map((item) => {
          return (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          )
        })}
      </div>

      {!favoriteCard && (
        <div className="mt-auto flex">
          <AddToCart dish={dish} />
        </div>
      )}

      <FavoriteButton
        dishId={dish.id}
        favorite={dish.isFavorite}
        className="absolute right-3 top-3"
      />
    </div>
  )
}

export function DishItem({ dish }: DishItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${dish.id}`}
          className="font-semibold hover:underline"
        >
          {dish.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(dish.createdAt)}
          </p>
        </div>
      </div>
      <DishOperations dish={{ id: dish.id, title: dish.name }} />
    </div>
  )
}

DishItem.Skeleton = function DishItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
