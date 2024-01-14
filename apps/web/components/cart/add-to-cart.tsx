'use client'

import React from 'react'
import { RotateCw } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { Dish } from '@/lib/types/definitions'

import { Button } from '../ui/button'
import { updateCart } from './actions'

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
      {pending && <RotateCw className="h-4 w-4 animate-spin" />}
      Adicionar
    </Button>
  )
}

export function AddToCart({ dish }: { dish: Dish }) {
  const [message, formAction] = useFormState(updateCart, null)

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
