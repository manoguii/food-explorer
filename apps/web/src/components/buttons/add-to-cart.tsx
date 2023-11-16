'use client'

import React from 'react'
import { MinusIcon, Plus, RotateCw } from 'lucide-react'
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
    <>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <MinusIcon />
        </Button>

        <span>1</span>

        <Button size="icon" variant="ghost">
          <Plus />
        </Button>
      </div>

      <Button variant="destructive" className="gap-2" onClick={handleAddToCart}>
        {loading && <RotateCw className="h-4 w-4 animate-spin" />}
        Adicionar
      </Button>
    </>
  )
}
