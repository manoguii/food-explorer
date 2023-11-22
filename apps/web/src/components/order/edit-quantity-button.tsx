import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'

export function EditItemQuantityButton({
  type,
  dishId,
}: {
  type: 'plus' | 'minus'
  dishId: string
}) {
  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        console.log(dishId)
        e.preventDefault()
      }}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-gray-800 hover:opacity-80 disabled:cursor-not-allowed',
        {
          'ml-auto': type === 'minus',
        },
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-gray-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-gray-500" />
      )}
    </button>
  )
}
