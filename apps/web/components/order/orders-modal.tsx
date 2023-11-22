'use client'

import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/use-cart-store'
import Link from 'next/link'
import { CreateOrderButton } from './create-order'
import Price from '../price'
import { DeleteItemButton } from './delete-item'
import { EditItemQuantityButton } from './edit-quantity-button'
import { OrdersModalEmpty } from './order-modal-empty'
import { ScrollArea } from '../ui/scroll-area'

export function OrdersModal() {
  const { cart, getTotal } = useCartStore()
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<'right' | 'bottom'>('right')

  const closeCart = () => setOpen(false)

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
          <div className="flex h-full flex-col justify-between overflow-hidden p-1">
            <ScrollArea>
              <ul className="flex-grow overflow-auto py-4">
                {cart.map((item, i) => {
                  return (
                    <li key={i} className="flex w-full flex-col">
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
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
                          <div className="ml-auto flex flex-row items-center rounded-lg border border-gray-200 p-1 dark:border-gray-800">
                            <EditItemQuantityButton
                              dishId={item.id}
                              type="minus"
                              quantity={item.quantity || 1}
                            />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">
                                {item.quantity}
                              </span>
                            </p>
                            <EditItemQuantityButton
                              dishId={item.id}
                              type="plus"
                              quantity={item.quantity || 1}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>

            <div className="py-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="mb-3 flex items-center justify-between border-gray-200 pb-1">
                <p>Taxas</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={'0'}
                  currencyCode={'BRL'}
                />
              </div>
              <div className="mb-3 flex items-center justify-between border-gray-200 pb-1 pt-1">
                <p>Entrega</p>
                <p className="text-right">Entrega gratis</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-gray-200 pb-1 pt-1">
                <p>Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={getTotal().toString()}
                  currencyCode={'BRL'}
                />
              </div>
              <CreateOrderButton />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
