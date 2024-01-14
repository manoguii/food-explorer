'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCartIcon } from 'lucide-react'

import { CartWithDetails } from '@/lib/types/definitions'

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
import { DeleteItemButton } from './delete-item'
import { EditDishQuantityButton } from './edit-dish-quantity-button'

export function CartModal({ cart }: { cart: CartWithDetails | undefined }) {
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<'right' | 'bottom'>('right')

  const closeCart = () => setOpen(false)

  async function handleCreateOrder() {
    console.log('handleCreateOrder')
  }

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
        <Button className="group relative" size="icon" variant="outline">
          <ShoppingCartIcon className="h-4 transition-all ease-in-out group-hover:scale-110" />

          {cart?.dishes.length ? (
            <span className="absolute right-0 top-0 -mr-2 -mt-2 flex h-4 w-4 items-center justify-center rounded bg-blue-600 text-[11px] font-medium text-white">
              {cart.dishes.length}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className="max-h-[calc(100vh-20%)] overflow-y-auto p-4 sm:max-h-screen sm:max-w-xl sm:p-6"
      >
        <SheetHeader>
          <SheetTitle className="mb-6 text-2xl">Meus pedidos</SheetTitle>
        </SheetHeader>

        {!cart ? (
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
                {cart.dishes.map((item, i) => {
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
                            {item.description.slice(0, 50).concat('...')}
                          </p>
                        </div>
                      </Link>

                      <div className="flex h-16 flex-col justify-between">
                        <Price
                          className="flex justify-end space-y-2 text-right text-sm"
                          amount={item.price.toString()}
                          currencyCode={'BRL'}
                        />

                        <div className="flex h-max items-center rounded-lg border border-gray-200 p-1 dark:border-gray-800">
                          <EditDishQuantityButton type="minus" dish={item} />

                          <p className="w-6 text-center">
                            <span className="w-full text-sm">
                              {item.quantity}
                            </span>
                          </p>

                          <EditDishQuantityButton type="plus" dish={item} />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>

            <div className="space-y-6 py-4">
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center justify-between border-gray-200">
                  <p>Entrega</p>
                  <p className="text-right">Entrega gratis</p>
                </div>

                <div className="flex items-center justify-between border-gray-200">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.totalAmount.toString()}
                    currencyCode={'BRL'}
                  />
                </div>
              </div>

              <ButtonWithLoading
                className="ml-auto block w-max"
                isLoading={false}
                onClick={handleCreateOrder}
              >
                Finalizar pedido
              </ButtonWithLoading>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
