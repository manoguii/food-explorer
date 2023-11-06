import Balancer from 'react-wrap-balancer'
import { Button } from '@/components/ui/button'
import { Dish } from '@/lib/types/definitions'
import { MinusIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import React from 'react'

interface CardProps extends LinkProps {
  dish: Dish
}

export function Card({ dish, ...props }: CardProps) {
  const { name, description, price, attachments } = dish

  return (
    <div className="flex min-h-[462px] max-w-xs flex-col items-center justify-between gap-4 rounded-md bg-[#00070A] p-6">
      <Link className="flex flex-col items-center gap-3" {...props}>
        <Image
          src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`}
          alt={description}
          width={176}
          height={176}
          quality={100}
        />

        <h4 className="text-center text-2xl font-bold">
          <Balancer>{name}</Balancer>
        </h4>

        <p className="text-center text-zinc-400">
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

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost">
            <MinusIcon />
          </Button>
          <span>01</span>
          <Button size="icon" variant="ghost">
            <Plus />
          </Button>
        </div>

        <Button variant="destructive">Adicionar</Button>
      </div>
    </div>
  )
}
