import Balancer from 'react-wrap-balancer'
import { Dish } from '@/lib/types/definitions'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { AddToCart } from './buttons'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'

interface CardProps extends LinkProps {
  dish: Dish
}

export function FavoriteCard({ dish }: { dish: Dish }) {
  const imageSrc = dish.attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${dish.attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <div className="grid grid-cols-[max-content_1fr] gap-4 rounded-lg bg-gray-900 p-4">
      <Image
        src={imageSrc}
        width={100}
        height={100}
        alt=""
        className="h-24 w-24 rounded-full object-cover"
      />

      <div className="flex flex-col place-content-center gap-2">
        <div>
          <h2 className="text-xl font-semibold">{dish.name}</h2>
          <p className="text-muted-foreground">{dish.description}</p>
        </div>

        <Button variant="destructive" size="icon" className="ml-auto">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function Card({ dish, ...props }: CardProps) {
  const { name, description, price, attachments } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <div className="flex min-h-[462px] flex-col items-center justify-between gap-4 rounded-lg bg-gray-50/70 p-6 dark:bg-[#00070A]">
      <Link className="flex w-full flex-col items-center gap-3" {...props}>
        <Image
          src={imageSrc}
          alt={description}
          width={176}
          height={176}
          quality={100}
          className="h-[160px] w-[160px] rounded-full object-cover sm:h-[176px] sm:w-[176px]"
        />

        <h4 className="text-center text-2xl font-bold">
          <Balancer>{name}</Balancer>
        </h4>

        <p className="w-full text-center text-zinc-400">
          <Balancer>
            {description.length > 50
              ? `${description.slice(0, 40)}...`
              : description}
          </Balancer>
        </p>

        <strong className="block text-3xl text-sky-500">
          R$ {price.toFixed(2)}
        </strong>
      </Link>

      <AddToCart />
    </div>
  )
}
