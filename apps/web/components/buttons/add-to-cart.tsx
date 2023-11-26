'use client'

import React from 'react'
import { PlusIcon, RotateCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Dish } from '@/lib/types/definitions'
import { useCartStore } from '@/lib/use-cart-store'

export function AddToCart({ dish }: { dish: Dish }) {
  const [loading, setLoading] = React.useState(false)
  const { addToCart } = useCartStore()

  async function handleAddToCart() {
    setLoading(true)
    await addToCart(dish)
    setLoading(false)
  }

  return (
    <Button
      variant="destructive"
      className="w-full gap-2"
      onClick={handleAddToCart}
    >
      {loading ? (
        <RotateCw className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      Adicionar aos pedidos
    </Button>
  )
}