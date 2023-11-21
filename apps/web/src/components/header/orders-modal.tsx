'use client'

import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { ScrollArea } from '../ui/scroll-area'
import { useCartStore } from '@/lib/use-cart-store'
import Link from 'next/link'
import { CartItem } from '@/lib/types/definitions'
import { CreateOrderButton } from '../buttons/create-order'

export function OrdersModal() {
  const { cart, getTotal } = useCartStore()
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<'right' | 'bottom'>('right')

  React.useEffect(() => {
    const verifySide = () => {
      if (window.innerWidth <= 640) {
        setSide('bottom')
      } else {
        setSide('right')
      }
    }

    verifySide()

    window.addEventListener('resize', verifySide)

    return () => {
      window.removeEventListener('resize', verifySide)
    }
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Pedidos ({cart.length})</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className="max-h-[calc(100vh-20%)] overflow-y-auto sm:max-h-screen sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle className="mb-6 text-2xl">Meus pedidos</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <OrdersModalEmpty />
        ) : (
          <div className="flex h-[90%] flex-col justify-between gap-6">
            <ScrollArea className="my-4 h-[300px] py-4 pr-6">
              <div className="space-y-3">
                {cart.map((item) => (
                  <OrderCard key={item.id} dish={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col sm:flex-col">
              <div>
                <div className="flex justify-between text-sm">
                  <p>Cupom de desconto</p>
                  <p>R$ 0</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>Taxa de serviço</p>
                  <p>R$ 0,99</p>
                </div>
              </div>

              <div className="mb-2 mt-6 flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <strong className="text-xl font-bold">R$ {getTotal()}</strong>
              </div>

              <CreateOrderButton />
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function OrdersModalEmpty() {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center overflow-hidden text-center">
      <Image src="/images/empty-cart.png" width={260} height={220} alt="" />
      <SheetTitle>Seu carrinho está vazio</SheetTitle>
      <SheetDescription>
        Voce ainda não adicionou nenhum prato ao seu pedido.
      </SheetDescription>
    </div>
  )
}

export function OrderCard({ dish }: { dish: CartItem }) {
  const { removeFromCart } = useCartStore()
  const { id, name, description, price, attachments, slug } = dish

  const imageSrc = attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <div className="grid grid-cols-[max-content_1fr_max-content] gap-4">
      <div className="flex aspect-square max-h-[90px] max-w-[90px] items-center place-self-center overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={''}
          width={60}
          height={60}
          quality={100}
          priority
          className="aspect-square object-cover"
        />
      </div>

      <div className="">
        <Link href={`/dish/${slug}`}>
          <h3 className="font-semibold leading-none tracking-tight">
            {dish.quantity} x {name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {description.length > 50
              ? `${description.slice(0, 40)}...`
              : description}
          </p>
        </Link>

        <button
          className="text-sm text-red-500 transition-colors hover:text-red-600"
          onClick={() => removeFromCart(id)}
        >
          Remover
        </button>
      </div>

      <strong className="mr-4 font-semibold text-primary">R$ {price}</strong>
    </div>
  )
}