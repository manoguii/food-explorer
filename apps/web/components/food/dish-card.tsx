import Image from 'next/image'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import { DishWithDetails } from '@/lib/types/definitions'

import { shimmer } from '../skeletons'
import { Badge } from '../ui/badge'
import Price from './price'

const TOTAL_INGREDIENTS = 5

export function DishCard({ dish }: { dish: DishWithDetails }) {
  return (
    <div className="group flex h-full flex-col gap-3">
      <Link
        href={`/food/dish/${dish.slug}`}
        className="flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
      >
        <Image
          className="aspect-square object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-80"
          alt={dish.description}
          src={dish.attachments[0].url}
          width={400}
          height={400}
          quality={100}
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
        />
      </Link>

      <div className="grid place-items-center gap-2 px-3">
        <Link href={`/food/dish/${dish.slug}`}>
          <h4 className="text-lg font-semibold leading-tight">{dish.name}</h4>
        </Link>

        <Price
          className="text-xl font-semibold text-secondary-foreground"
          amount={dish.price.toString()}
          currencyCode="BRL"
          currencyCodeClassName="hidden @[275px]/label:inline"
        />

        <div className="my-2 flex flex-wrap items-center justify-center gap-1">
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
    </div>
  )
}

DishCard.Skeleton = function CardSkeleton() {
  return (
    <div className="overflow-hidden">
      {/* Image */}
      <div
        className={`${shimmer} relative mb-4 flex aspect-square min-h-full flex-col justify-between overflow-hidden rounded-t bg-muted/10 shadow-sm`}
      ></div>

      <div className="grid place-items-center gap-2 px-3">
        {/* Title */}
        <Skeleton className="h-4 w-36" />

        {/* Price */}
        <Skeleton className="h-5 w-16" />

        {/* Ingredients */}
        <div className="my-2 flex flex-wrap items-center justify-center gap-1">
          <Skeleton className="h-[19px] w-16 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-14 rounded-full" />
          <Skeleton className="h-[19px] w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
