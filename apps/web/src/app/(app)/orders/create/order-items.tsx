'use client'

import { useCartStore } from '@/lib/store/cart'
import { OrderCard } from '../../../../components/cards'
import { ShoppingCartIcon } from 'lucide-react'

export function OrderItems() {
  const { cart, getTotal } = useCartStore()

  const total = getTotal()
  return (
    <>
      {cart.length === 0 ? (
        <div className="mt-10 flex w-full flex-col items-center justify-center overflow-hidden">
          <ShoppingCartIcon className="h-16 w-16" />
          <p className="mt-6 text-center text-2xl font-bold">
            Voce ainda não adicionou nenhum prato ao seu pedido.
          </p>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <OrderCard key={item.id} dish={item} />
          ))}

          <div className="flex justify-between">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-semibold">R$ {total}</span>
          </div>
        </>
      )}
    </>
  )
}
