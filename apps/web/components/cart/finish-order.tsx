'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { LoadingDots } from '../loading-dots'
import { Button } from '../ui/button'
import { finishOrder } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      aria-disabled={pending}
      aria-label="Finalizar pedido"
      disabled={pending}
      className="w-full"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? (
        <LoadingDots className="bg-primary-foreground" />
      ) : (
        'Finalizar pedido'
      )}
    </Button>
  )
}

export function FinishOrder() {
  const [message, formAction] = useFormState(finishOrder, null)

  return (
    <form action={formAction}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
