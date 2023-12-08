'use client'

import React from 'react'
import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'
import { toggleFavoriteDish } from '@/app/actions'

import { toast } from '../ui/use-toast'

interface FavoriteButtonProps {
  dishId: string
  favorite: boolean
}

export function FavoriteButton({
  dishId,
  favorite,
  ...rest
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = React.useState<'idle' | 'loading'>('idle')

  async function handleAddFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    setIsLoading('loading')
    const result = await toggleFavoriteDish(dishId, favorite)

    if (result.success) {
      toast({
        title: favorite
          ? 'Prato removido dos favoritos !'
          : 'Prato adicionado aos favoritos !',
        description: result.message,
      })
    } else {
      toast({
        title: favorite
          ? 'Erro ao remover prato dos favoritos !'
          : 'Erro ao adicionar prato aos favoritos !',
        description: result.message,
        variant: 'destructive',
      })
    }
    setIsLoading('idle')
  }

  return (
    <button
      className="w-max rounded-full p-2"
      disabled={isLoading === 'loading'}
      onClick={handleAddFavorite}
      {...rest}
    >
      <Heart
        className={cn('h-5 w-5 transition-colors hover:text-red-500', {
          'fill-red-500 text-red-500': favorite,
        })}
      />
    </button>
  )
}
