import React from 'react'
import {
  Card as CardRoot,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Dish } from '@/lib/types/definitions'
import Image from 'next/image'
import { AddToFavorite } from '../buttons/add-to-favorite'
import { Dot } from 'lucide-react'

export function FeaturedDishCard({
  dish,
}: {
  dish: Dish & { isFavorite: boolean }
}) {
  const { name, description, price, attachments, isFavorite, category } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  const descriptionShort =
    description.length > 20 ? `${description.slice(0, 20)}...` : description

  const titleShort = name.length > 20 ? `${name.slice(0, 20)}...` : name

  return (
    <CardRoot className="grid grid-cols-[max-content_1fr] !p-3">
      <div className="flex aspect-square max-h-[80px] max-w-[80px] items-center place-self-center overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={description}
          width={80}
          height={80}
          quality={100}
          priority
          className="aspect-square object-cover"
        />
      </div>

      <div className="relative flex flex-col space-y-1.5 p-6 py-0">
        <CardTitle className="whitespace-nowrap text-base">
          {titleShort}
        </CardTitle>

        <CardDescription className="!mt-0 text-sm">
          {descriptionShort}
        </CardDescription>

        <div className="mt-4 flex items-center">
          <CardDescription className="text-sm font-medium text-primary">
            R$ {price}
          </CardDescription>

          <Dot className="mx-1 inline-block h-2 w-2 text-primary" />

          <CardDescription className="text-sm text-primary">
            {category}
          </CardDescription>
        </div>

        <AddToFavorite
          className="absolute bottom-0 right-0 h-8 w-8"
          dishId={dish.id}
          isFavorite={isFavorite}
        />
      </div>
    </CardRoot>
  )
}
