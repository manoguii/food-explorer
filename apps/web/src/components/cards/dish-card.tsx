import {
  Card as CardRoot,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Dish } from '@/lib/types/definitions'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { AddToCart } from '../buttons/add-to-cart'
import { AddToFavorite } from '../buttons/add-to-favorite'

export function DishCard({
  dish,
  isFavorite = false,
  ...props
}: {
  dish: Dish
  isFavorite?: boolean
}) {
  const { name, description, price, attachments, slug } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  const cardDescription =
    description.length > 60 ? `${description.slice(0, 50)}...` : description

  return (
    <Link href={`/food/dish/${slug}`}>
      <CardRoot
        className="relative flex h-full flex-col justify-between"
        {...props}
      >
        <div className="relative mb-4 flex aspect-video max-h-[176px] w-full items-center overflow-hidden">
          <Image
            src={imageSrc}
            alt={description}
            fill
            quality={100}
            priority
            className="aspect-video rounded-t-md object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-gray-50/0 p-0 dark:from-gray-950 dark:via-gray-950/0"></div>
        </div>

        <CardContent>
          <CardTitle className="text-center">{name}</CardTitle>

          <CardDescription className="text-center">
            {cardDescription}
          </CardDescription>

          <div className="mt-2 w-full flex-none text-center text-3xl font-bold text-blue-600">
            ${price}
          </div>
        </CardContent>

        <CardFooter className="flex items-center gap-4">
          <AddToCart dish={dish} />
        </CardFooter>

        <AddToFavorite
          dishId={dish.id}
          isFavorite={isFavorite}
          className="absolute right-3 top-3"
        />
      </CardRoot>
    </Link>
  )
}
