'use client'

import React from 'react'
import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'
import { toggleFavoriteDish } from '@/app/actions'

import { Button, ButtonProps } from '../ui/button'
import { toast } from '../ui/use-toast'

interface FavoriteButtonProps extends ButtonProps {
  dishId: string
  favorite: boolean
}

export function FavoriteButton({
  dishId,
  favorite,
  className,
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
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'group rounded-lg border bg-white/70 backdrop-blur-md dark:border-neutral-800 dark:bg-black/70',
        isLoading === 'loading' && 'animate-pulse cursor-not-allowed',
        className,
      )}
      disabled={isLoading === 'loading'}
      onClick={handleAddFavorite}
      {...rest}
    >
      <Heart
        className={cn('h-4 w-4 fill-gray-50 text-gray-50', {
          'fill-red-500 text-red-500': favorite,
        })}
      />
    </Button>
  )
}
