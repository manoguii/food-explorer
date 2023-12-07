import Image from 'next/image'
import Link from 'next/link'

import { Category, Dish } from '@/lib/types/definitions'
import { cn, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

import { AddToCart } from './buttons/add-to-cart'
import { FavoriteButton } from './buttons/favorite-button'
import { Operations } from './operations'
import Price from './price'
import { shimmer } from './skeletons'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

//  Components

export function PrimaryCard({
  dish,
  withoutFooter = false,
}: {
  dish: Dish
  withoutFooter?: boolean
}) {
  return (
    <div className="group flex h-full flex-col gap-3 rounded-lg border">
      <Link
        href={`/food/dish/${dish.slug}`}
        className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-lg border-b bg-white dark:bg-gray-950"
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
            'pb-3': !dish.isFavorite,
          })}
        >
          {dish.ingredients.map((item) => {
            return (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            )
          })}
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

export function SecondaryCard({ dish }: { dish: Dish }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row justify-between gap-2">
        <div>
          <Link
            href={`/editor/${dish.slug}`}
            className="font-semibold hover:underline"
          >
            <CardTitle className="text-lg">{dish.name}</CardTitle>
          </Link>
          <CardDescription className="!mt-0">
            {dish.description}
          </CardDescription>
        </div>
        <Operations
          item={{
            id: dish.id,
            name: dish.name,
            slug: dish.slug,
          }}
          entity="dish"
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-1">
          {dish.ingredients.map((item) => {
            return (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryCard({ category }: { category: Category }) {
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
        item={{
          id: category.id,
          name: category.name,
          slug: category.name.toLowerCase(),
        }}
        entity="category"
      />
    </div>
  )
}

// Skeletons

PrimaryCard.Skeleton = function CardSkeleton({
  favoriteCard,
}: {
  favoriteCard?: boolean
}) {
  return (
    <div>
      {/* Image */}
      <div
        className={`${shimmer} relative mb-4 flex aspect-video min-h-full flex-col justify-between overflow-hidden rounded-lg border bg-card shadow-sm`}
      ></div>

      <div className="mt-auto px-2 pb-2">
        {/* Title */}
        <Skeleton className="h-5 w-56" />

        {/* Description */}
        <Skeleton className="mt-2 h-3 w-72" />

        {/* Ingredients */}
        <div className="mb-4 mt-2 flex flex-wrap items-center gap-1">
          <Skeleton className="h-[19px] w-16 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
        </div>

        {/* Add to cart */}
        {!favoriteCard && (
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </div>
    </div>
  )
}

SecondaryCard.Skeleton = function SecondaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-2">
        <div>
          {/* Title */}
          <Skeleton className="h-5 w-48" />

          {/* Description */}
          <Skeleton className="mt-3 h-3 w-64" />
        </div>
        <div className="h-8 w-8 rounded-md border" />
      </CardHeader>
      <CardContent>
        {/* Ingredients */}
        <div className="mb-1 mt-1 flex flex-wrap items-center gap-1">
          <Skeleton className="h-[19px] w-16 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

CategoryCard.Skeleton = function CategoryCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="h-8 w-8 rounded-md border" />
    </div>
  )
}
