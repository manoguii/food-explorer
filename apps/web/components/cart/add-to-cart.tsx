'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { Dish } from '@/lib/types/definitions'

import { LoadingDots } from '../loading-dots'
import { Button } from '../ui/button'
import { addItemToCart } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="destructive"
      className="gap-1"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Adicionar'}
    </Button>
  )
}

export function AddToCart({ dish }: { dish: Dish }) {
  const [message, formAction] = useFormState(addItemToCart, null)

  const payload = {
    dishId: dish.id,
    quantity: 1,
  }

  const actionWithVariant = formAction.bind(null, payload)

  return (
    <form action={actionWithVariant}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
