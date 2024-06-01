import Image from 'next/image'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import { DishWithDetails } from '@/lib/types/definitions'
import { cn } from '@/lib/utils'

import { AddToCart } from '../cart/add-to-cart'
import { shimmer } from '../skeletons'
import { Badge } from '../ui/badge'
import { FavoriteButton } from './favorite-button'
import Price from './price'

const TOTAL_INGREDIENTS = 5

export function DishCard({
  dish,
  withoutFooter = false,
}: {
  dish: DishWithDetails
  withoutFooter?: boolean
}) {
  return (
    <div className="group flex h-full flex-col gap-3 rounded-lg border">
      <Link
        href={`/food/dish/${dish.slug}`}
        className="flex items-center justify-center overflow-hidden rounded-t-lg border-b bg-white p-4 dark:bg-gray-950"
      >
        <Image
          className="aspect-square h-48 w-48 rounded-full object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-80"
          alt={dish.description}
          src={dish.attachments[0].url}
          width={400}
          height={400}
          quality={100}
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
        />
      </Link>

      <div className="px-3">
        <div className="flex justify-between gap-2">
          <div className="w-5/6">
            <Link href={`/food/dish/${dish.slug}`}>
              <h4 className="text-lg font-semibold leading-tight">
                {dish.name}
              </h4>
            </Link>

            <p className="w-full truncate text-sm text-muted-foreground">
              {dish.description}
            </p>
          </div>

          <FavoriteButton dishId={dish.id} favorite={dish.isFavorite} />
        </div>

        <div
          className={cn('my-2 flex flex-wrap items-center gap-1', {
            'pb-3': withoutFooter,
          })}
        >
          {dish.ingredients.slice(0, TOTAL_INGREDIENTS).map((item) => {
            return (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            )
          })}
          {dish.ingredients.length > TOTAL_INGREDIENTS && (
            <Badge variant="secondary">
              <span className="max-w-[120px] truncate">
                +{dish.ingredients.length - TOTAL_INGREDIENTS}
              </span>
            </Badge>
          )}
        </div>
      </div>

      {!withoutFooter && (
        <div className="flex flex-1 items-end justify-between gap-2 px-3 pb-3">
          <Price
            className="text-xl font-semibold text-secondary-foreground"
            amount={dish.price.toString()}
            currencyCode="BRL"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />

          <AddToCart dish={dish} />
        </div>
      )}
    </div>
  )
}

DishCard.Skeleton = function CardSkeleton({
  favoriteCard,
}: {
  favoriteCard?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Image */}
      <div
        className={`${shimmer} relative mb-4 flex aspect-video min-h-full flex-col justify-between overflow-hidden rounded-t border-b bg-card shadow-sm`}
      ></div>

      <div className="mt-auto px-2 pb-2">
        {/* Title */}
        <Skeleton className="h-5 w-56" />

        {/* Description */}
        <Skeleton className="mt-3 h-2.5 w-64" />

        {/* Ingredients */}
        <div className="my-4 flex flex-wrap items-center gap-1">
          <Skeleton className="h-[19px] w-16 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
        </div>

        {/* Add to cart */}
        {!favoriteCard && (
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </div>
    </div>
  )
}
