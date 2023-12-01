import { MinusIcon, PlusIcon } from 'lucide-react'

import { useCartStore } from '@/lib/use-cart-store'

import { Button } from '../ui/button'

export function DishQuantityCounter({ dishId }: { dishId: string }) {
  const { cart } = useCartStore()

  const dish = cart.find((item) => item.id === dishId)

  if (!dish) {
    return null
  }

  return (
    <div className="flex h-max items-center rounded-lg border border-gray-200 p-1 dark:border-gray-800">
      <DishQuantityCounter.DecrementButton
        dishId={dishId}
        quantity={dish.quantity || 1}
      />
      <p className="w-6 text-center">
        <span className="w-full text-sm">{dish.quantity}</span>
      </p>

      <DishQuantityCounter.IncrementButton
        dishId={dishId}
        quantity={dish.quantity || 1}
      />
    </div>
  )
}

DishQuantityCounter.IncrementButton = function IncrementButton({
  dishId,
  quantity,
}: {
  dishId: string
  quantity: number
}) {
  const { changeDishQuantity } = useCartStore()

  return (
    <Button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        changeDishQuantity(dishId, quantity + 1)
      }}
      aria-label="Increment dish quantity"
      className="h-7 rounded-md px-2"
      variant={'ghost'}
    >
      <PlusIcon className="h-4 w-4 dark:text-gray-500" />
    </Button>
  )
}

DishQuantityCounter.DecrementButton = function DecrementButton({
  dishId,
  quantity,
}: {
  dishId: string
  quantity: number
}) {
  const { changeDishQuantity } = useCartStore()

  return (
    <Button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        changeDishQuantity(dishId, quantity - 1)
      }}
      aria-label="Decrement dish quantity"
      disabled={quantity === 1}
      className="h-7 rounded-md px-2"
      variant={'ghost'}
    >
      <MinusIcon className="h-4 w-4 dark:text-gray-500" />
    </Button>
  )
}
