import {
  Card as CardRoot,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dish } from '@/lib/types/definitions'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { Heart, Trash } from 'lucide-react'
import Link from 'next/link'
import { AddToCart, ChangeQuantityButtons } from './buttons'
import { CartItem, useCartStore } from '@/lib/store/cart'

export function OrderCard({ dish }: { dish: CartItem }) {
  const { remove } = useCartStore()
  const { id, name, description, price, attachments, slug } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <CardRoot className="grid grid-cols-[max-content_1fr] pl-4">
      <div className="flex aspect-square max-h-[100px] max-w-[100px] items-center place-self-center overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={''}
          width={90}
          height={90}
          quality={100}
          priority
          className="aspect-square object-cover"
        />
      </div>

      <div className="flex flex-col space-y-1.5 p-4">
        <Link href={`/dashboard/dish/${slug}`}>
          <CardTitle>{name}</CardTitle>
        </Link>
        <CardDescription>
          {description.length > 50
            ? `${description.slice(0, 40)}...`
            : description}
        </CardDescription>

        <div className="mt-2 flex w-full items-center justify-between">
          <strong className="mr-4 font-normal text-muted-foreground">
            ${price}
          </strong>

          <ChangeQuantityButtons dishId={dish.id} />

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => remove(id)}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </CardRoot>
  )
}

export function FavoriteCard({ dish }: { dish: Dish }) {
  const { name, description, attachments, slug } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <CardRoot className="grid grid-cols-[max-content_1fr] pl-4">
      <div className="flex aspect-square max-h-[100px] max-w-[100px] items-center place-self-center overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={description}
          width={100}
          height={100}
          quality={100}
          priority
          className="aspect-square object-cover"
        />
      </div>

      <CardHeader className="p-4">
        <Link href={`/dashboard/dish/${slug}`}>
          <CardTitle>{name}</CardTitle>
        </Link>
        <CardDescription>
          {description.length > 50
            ? `${description.slice(0, 40)}...`
            : description}
        </CardDescription>

        <Button variant="ghost" size="icon" className="ml-auto">
          <Trash className="h-5 w-5" />
        </Button>
      </CardHeader>
    </CardRoot>
  )
}

export function DishCard({ dish, ...props }: { dish: Dish }) {
  const { name, description, price, attachments, slug } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <CardRoot
      className="relative flex h-full flex-col justify-between"
      {...props}
    >
      <CardHeader className="items-center">
        <div className="flex aspect-square max-h-[176px] max-w-[176px] items-center overflow-hidden rounded-lg p-0">
          <Image
            src={imageSrc}
            alt={description}
            width={176}
            height={176}
            quality={100}
            priority
            className="aspect-square object-cover"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Link href={`/dashboard/dish/${slug}`}>
          <CardTitle className="text-center">{name}</CardTitle>
        </Link>
        <CardDescription className="text-center">
          {description.length > 60
            ? `${description.slice(0, 50)}...`
            : description}
        </CardDescription>

        <div className="mt-2 w-full flex-none text-center text-3xl font-bold text-blue-600">
          ${price}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-4">
        <ChangeQuantityButtons dishId={dish.id} />
        <AddToCart dish={dish} />
      </CardFooter>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 rounded-full"
      >
        <Heart className="h-5 w-5" />
      </Button>
    </CardRoot>
  )
}