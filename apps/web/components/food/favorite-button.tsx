'use client'

import React from 'react'
import { toggleFavoriteDish } from '@/db/mutations'
import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

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

    try {
      await toggleFavoriteDish(dishId, favorite)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro ao favoritar prato',
          description: error.message,
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading('idle')
    }
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
