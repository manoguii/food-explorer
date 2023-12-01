import React from 'react'
import { useRouter } from 'next/navigation'
import { RotateCw } from 'lucide-react'

import { useCartStore } from '@/lib/use-cart-store'
import { createOrder } from '@/app/actions'

import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

export function CreateOrderButton({ closeCart }: { closeCart: () => void }) {
  const [loading, setLoading] = React.useState(false)
  const { push } = useRouter()
  const { cart, clearCart } = useCartStore()

  async function handleCreateOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    const items = cart.map((item) => ({
      dishId: item.id,
      quantity: item.quantity || 1,
    }))

    const result = await createOrder(items)

    if (result.success) {
      toast({
        title: 'Pedido criado !',
        description:
          'Seu pedido foi criado com sucesso, acompanhe o status na página de pedidos.',
      })
    } else {
      toast({
        title: 'Erro ao criar pedido',
        description: 'Ocorreu um erro ao criar seu pedido, tente novamente.',
        variant: 'destructive',
      })
    }

    clearCart()
    closeCart()
    push('/food/orders')
    setLoading(false)
  }

  return (
    <form className="flex-1" onSubmit={handleCreateOrder}>
      <Button type="submit" className="gap-2">
        {loading && <RotateCw className="h-4 w-4 animate-spin" />}
        Finalizar pedido
      </Button>
    </form>
  )
}
