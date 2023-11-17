'use client'

import React from 'react'
import { addFavoriteDish } from '@/app/actions'
import { Heart } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../ui/button'

interface AddToFavoriteProps extends ButtonProps {
  dishId: string
  isFavorite: boolean
}

export function AddToFavorite({
  dishId,
  isFavorite,
  className,
  ...rest
}: AddToFavoriteProps) {
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
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'group rounded-full bg-red-600/10 text-red-500 transition-all hover:bg-red-600/20 hover:text-red-500',
        isLoading === 'loading' && 'animate-pulse cursor-not-allowed',
        className,
      )}
      disabled={isLoading === 'loading'}
      onClick={handleAddFavorite}
      {...rest}
    >
      <Heart
        className={cn('h-4 w-4 fill-red-500/20 group-hover:fill-red-500', {
          'fill-red-500': isFavorite,
        })}
      />
    </Button>
  )
}
