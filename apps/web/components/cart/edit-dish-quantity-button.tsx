import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { CartItem } from '@/lib/types/definitions'
import { LoadingDots } from '@/components/loading-dots'

import { updateItemQuantity } from './actions'

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      aria-disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': pending,
          'ml-auto': type === 'minus',
        },
      )}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-gray-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-gray-500" />
      )}
    </button>
  )
}

export function EditDishQuantityButton({
  dish,
  type,
}: {
  dish: CartItem
  type: 'plus' | 'minus'
}) {
  const [message, formAction] = useFormState(updateItemQuantity, null)

  const payload = {
    dishId: dish.id,
    quantity: type === 'plus' ? dish.quantity + 1 : dish.quantity - 1,
  }

  const actionWithVariant = formAction.bind(null, payload)

  return (
    <form action={actionWithVariant}>
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}
