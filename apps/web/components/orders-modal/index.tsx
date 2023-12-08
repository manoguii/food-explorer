'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

import { useCartStore } from '@/lib/use-cart-store'
import { createOrder } from '@/app/actions'

import { ButtonWithLoading } from '../buttons/button-with-loading'
import { EmptyPlaceholder } from '../empty-placeholder'
import Price from '../price'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { toast } from '../ui/use-toast'
import { DeleteItemButton } from './delete-item'
import { DishQuantityCounter } from './dish-quantity-counter'

export function OrdersModal() {
  const { cart, getTotal, clearCart } = useCartStore()
  const { push } = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<'right' | 'bottom'>('right')
  const [size, setSize] = React.useState<'default' | 'icon'>('default')

  const closeCart = () => setOpen(false)

  async function handleCreateOrder() {
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

  React.useEffect(() => {
    const verifySide = () => {
      if (window.innerWidth <= 640) {
        setSide('bottom')
        setSize('icon')
      } else {
        setSide('right')
        setSize('default')
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
        <Button variant="destructive" size={size} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden lg:inline-block">
            Pedidos ({cart.length})
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className="max-h-[calc(100vh-20%)] overflow-y-auto p-4 sm:max-h-screen sm:max-w-xl sm:p-6"
      >
        <SheetHeader>
          <SheetTitle className="mb-6 text-2xl">Meus pedidos</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="logo" />
            <EmptyPlaceholder.Title>
              Nenhuma prato foi adicionado ao carrinho
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Adicione pratos ao carrinho e faça seu pedido.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        ) : (
          <div className="flex h-[90%] flex-col justify-between overflow-hidden p-1">
            <ScrollArea>
              <ul className="grow overflow-auto py-4 pr-3">
                {cart.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="relative flex w-full flex-row justify-between px-1 py-4"
                    >
                      <div className="absolute z-40 -mt-2 ml-[55px]">
                        <DeleteItemButton dishId={item.id} />
                      </div>

                      <Link
                        href={`/food/dish/${item.slug}`}
                        onClick={closeCart}
                        className="z-30 flex flex-row space-x-4"
                      >
                        <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800">
                          <Image
                            className="h-full w-full object-cover"
                            width={64}
                            height={64}
                            alt={item.name}
                            src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${item.attachments[0].url}`}
                          />
                        </div>

                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight">{item.name}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </Link>

                      <div className="flex h-16 flex-col justify-between">
                        <Price
                          className="flex justify-end space-y-2 text-right text-sm"
                          amount={item.price.toString()}
                          currencyCode={'BRL'}
                        />

                        <DishQuantityCounter dishId={item.id} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>

            <div className="space-y-1 py-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between border-gray-200">
                <p>Entrega</p>
                <p className="text-right">Entrega gratis</p>
              </div>
              <div className="flex items-center justify-between border-gray-200">
                <p>Taxas</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={'0'}
                  currencyCode={'BRL'}
                />
              </div>
              <div className="flex items-center justify-between border-gray-200">
                <p>Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={getTotal().toString()}
                  currencyCode={'BRL'}
                />
              </div>
            </div>

            <ButtonWithLoading
              className="ml-auto w-max"
              isLoading={loading}
              onClick={handleCreateOrder}
            >
              Finalizar pedido
            </ButtonWithLoading>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
