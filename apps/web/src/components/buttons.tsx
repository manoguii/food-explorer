'use client'

import React from 'react'
import { addFavoriteDish, createOrder } from '@/app/actions'
import { Loader2, MinusIcon, Plus, Heart } from 'lucide-react'
import { toast } from './ui/use-toast'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useCartStore } from '@/lib/store/cart'
import { Dish } from '@/lib/types/definitions'
import { useRouter } from 'next/navigation'

export function ChangeQuantityButtons({ dishId }: { dishId: string }) {
  const { increment, countItem, decrement } = useCartStore()

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" onClick={() => decrement(dishId)}>
        <MinusIcon />
      </Button>

      <span>{countItem(dishId)}</span>

      <Button size="icon" variant="ghost" onClick={() => increment(dishId)}>
        <Plus />
      </Button>
    </div>
  )
}

export function AddToCart({ dish }: { dish: Dish }) {
  const router = useRouter()
  const { add } = useCartStore()

  function handleAddToCart() {
    add(dish)
    router.replace('/orders/create')
  }

  return (
    <Button variant="destructive" onClick={handleAddToCart}>
      Adicionar
    </Button>
  )
}

export function AddToFavorite({
  dishId,
  isFavorite,
}: {
  dishId: string
  isFavorite: boolean
}) {
  const [isLoading, setIsLoading] = React.useState<'idle' | 'loading'>('idle')

  async function handleAddFavorite() {
    setIsLoading('loading')
    const result = await addFavoriteDish(dishId)

    if (result.success) {
      toast({
        title: 'Prato adicionado aos favoritos !',
        description: result.message,
      })
    } else {
      toast({
        title: 'Erro ao adicionar o prato aos favoritos !',
        description: result.message,
        variant: 'destructive',
      })
    }
    setIsLoading('idle')
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleAddFavorite} className="flex items-center gap-1">
        <Heart
          className={cn('h-4 w-4 stroke-indigo-500', {
            'fill-indigo-500': isFavorite,
          })}
        />
        <span className="text-indigo-500">4.89</span>
      </button>

      <span className="font-normal text-slate-400">
        {isLoading === 'loading' && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {isLoading === 'idle' && ' (12)'}
      </span>
    </div>
  )
}

export function CreateOrderButton() {
  const { cart } = useCartStore()

  const items = cart.map((item) => ({
    dishId: item.id,
    quantity: item.count,
  }))

  return (
    <form action={() => createOrder(items)}>
      <Button className="w-full">Continue</Button>
    </form>
  )
}
