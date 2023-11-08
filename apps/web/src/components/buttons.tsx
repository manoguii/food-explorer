'use client'

import React from 'react'
import { addFavoriteDish } from '@/app/actions'
import { Loader2, Star, MinusIcon, Plus } from 'lucide-react'
import { toast } from './ui/use-toast'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

export function AddToCart() {
  return (
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
        <Star
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
