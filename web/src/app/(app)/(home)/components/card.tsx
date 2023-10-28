import { Button } from '@/components/ui/button'
import { MinusIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import React from 'react'

type CardProps = LinkProps

export function Card(props: CardProps) {
  return (
    <Link
      className="embla__slide flex max-w-xs flex-col items-center justify-center gap-3 rounded-md bg-[#00070A] p-6"
      {...props}
    >
      <Image
        src="/images/Dish.png"
        alt="Sobremesa"
        width={176}
        height={176}
        objectFit="cover"
        quality={100}
      />

      <h4 className="text-2xl font-bold">Spaguetti Gambe</h4>

      <p className="text-center text-zinc-400">
        Massa fresca com camarões e pesto.
      </p>

      <strong className="block text-3xl text-sky-500">R$ 79,97</strong>

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
    </Link>
  )
}
