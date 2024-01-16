'use client'

import React from 'react'
import { toggleFavoriteDish } from '@/db/mutations'
import { Heart } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { cn } from '@/lib/utils'

import { LoadingDots } from '../loading-dots'

interface FavoriteButtonProps {
  dishId: string
  favorite: boolean
}

function SubmitButton({ isFavorite }: { isFavorite: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-disabled={pending}
      className="flex w-max items-center justify-center rounded-full p-2"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? (
        <LoadingDots className="bg-destructive-foreground" />
      ) : (
        <Heart
          className={cn('h-5 w-5 transition-colors hover:text-red-500', {
            'fill-red-500 text-red-500': isFavorite,
          })}
        />
      )}
    </button>
  )
}

export function FavoriteButton({ dishId, favorite }: FavoriteButtonProps) {
  const [message, formAction] = useFormState(toggleFavoriteDish, null)

  const payload = {
    dishId,
    isFavorite: favorite,
  }

  const actionWithVariant = formAction.bind(null, payload)

  return (
    <form action={actionWithVariant}>
      <SubmitButton isFavorite={favorite} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
