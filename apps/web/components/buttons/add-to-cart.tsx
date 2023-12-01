'use client'

import React from 'react'
import { RotateCw } from 'lucide-react'

import { Dish } from '@/lib/types/definitions'
import { useCartStore } from '@/lib/use-cart-store'

import { Button } from '../ui/button'

export function AddToCart({ dish }: { dish: Dish }) {
  const [loading, setLoading] = React.useState(false)
  const { addToCart } = useCartStore()

  async function handleAddToCart() {
    setLoading(true)
    await addToCart(dish)
    setLoading(false)
  }

  return (
    <Button variant="destructive" className="gap-1" onClick={handleAddToCart}>
      {loading && <RotateCw className="h-4 w-4 animate-spin" />}
      Adicionar
    </Button>
  )
}
