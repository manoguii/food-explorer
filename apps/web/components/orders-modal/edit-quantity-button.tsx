import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useCartStore } from '@/lib/use-cart-store'

export function EditItemQuantityButton({
  type,
  dishId,
  quantity,
}: {
  type: 'plus' | 'minus'
  dishId: string
  quantity: number
}) {
  const { changeDishQuantity } = useCartStore()

  return (
    <Button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (type === 'plus') {
          changeDishQuantity(dishId, quantity + 1)
        } else {
          changeDishQuantity(dishId, quantity - 1)
        }
      }}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      disabled={type === 'minus' && quantity === 1}
      className="h-7 rounded-md px-2"
      variant={'ghost'}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-gray-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-gray-500" />
      )}
    </Button>
  )
}
