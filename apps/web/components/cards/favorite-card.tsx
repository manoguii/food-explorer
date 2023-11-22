import {
  Card as CardRoot,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dish } from '@/lib/types/definitions'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import Link from 'next/link'

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
        <Link href={`/food/dish/${slug}`}>
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
