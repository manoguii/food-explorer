import Image from 'next/image'
import Link from 'next/link'

import { Category, Dish } from '@/lib/types/definitions'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Operations } from '@/components/operations'

import { AddToCart } from './buttons/add-to-cart'
import { FavoriteButton } from './buttons/favorite-button'
import Price from './price'
import { Badge } from './ui/badge'

interface CategoryItemProps {
  category: Category
}

export function DishCard({
  dish,
  favoriteCard,
}: {
  dish: Dish
  favoriteCard?: boolean
}) {
  return (
    <div className="group flex h-full flex-col gap-3">
      <Link
        href={`/food/dish/${dish.slug}`}
        className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-white dark:bg-gray-950"
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

      <div className="px-2">
        <Link href={`/food/dish/${dish.slug}`}>
          <h4 className="text-lg font-semibold leading-tight">{dish.name}</h4>
        </Link>

        <p className="w-full truncate text-sm text-muted-foreground">
          {dish.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          {dish.ingredients.map((item) => {
            return (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            )
          })}
        </div>
      </div>

      {!favoriteCard && (
        <div className="flex flex-1 items-end justify-between gap-2 px-2 pb-2">
          <Price
            className="text-xl font-semibold text-secondary-foreground"
            amount={dish.price.toString()}
            currencyCode="BRL"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />

          <AddToCart dish={dish} />
        </div>
      )}

      <FavoriteButton
        dishId={dish.id}
        favorite={dish.isFavorite}
        className="absolute right-6 top-3"
      />
    </div>
  )
}

export function CategoryItem({ category }: CategoryItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${category.id}`}
          className="font-semibold hover:underline"
        >
          {category.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(category.createdAt)}
          </p>
        </div>
      </div>
      <Operations
        item={{ id: category.id, name: category.name }}
        entity="category"
      />
    </div>
  )
}

CategoryItem.Skeleton = function DishItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
