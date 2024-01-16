'use client'

import clsx from 'clsx'
import { X } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { LoadingDots } from '@/components/loading-dots'

import { removeItem } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-label="Remove cart item"
      aria-disabled={pending}
      disabled={pending}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 disabled:cursor-not-allowed',
      )}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? (
        <LoadingDots className="bg-primary" />
      ) : (
        <X className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  )
}

export function DeleteItemButton({ dishId }: { dishId: string }) {
  const [message, formAction] = useFormState(removeItem, null)
  const itemId = dishId
  const actionWithVariant = formAction.bind(null, itemId)

  return (
    <form action={actionWithVariant}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
