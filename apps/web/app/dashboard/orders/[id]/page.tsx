import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Dot } from 'lucide-react'

import { getOrderById } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Price from '@/components/price'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export default async function OrderDetails({
  params,
}: {
  params: {
    id: string
  }
}) {
  const order = await getOrderById(params.id)

  const dishes = order.dishes.map((dish) => ({
    ...dish,
    orderId: order.id,
  }))

  const subTotal = dishes.reduce((acc, dish) => {
    return acc + dish.price * dish.quantity
  }, 0)

  const total = subTotal + 2.8

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center gap-4">
        <Link
          className={buttonVariants({
            size: 'icon',
            variant: 'outline',
          })}
          href="/dashboard/orders"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Link>
        <h1 className="flex items-center gap-1 text-lg font-semibold md:text-xl">
          #{order.code} <Dot />{' '}
          <span className="font-normal text-gray-500 dark:text-gray-400">
            {order.client.name}{' '}
          </span>
          <Dot />
          <span className="font-normal text-gray-500 dark:text-gray-400">
            {formatDate(order.createdAt)}
          </span>
        </h1>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button size="icon" variant="outline">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button size="icon" variant="outline">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <CardTitle>Detalhes do pedido</CardTitle>
          <DataTable data={dishes} columns={columns} />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <div>
              <CardHeader className="flex flex-row items-center space-y-0">
                <CardTitle>Cliente</CardTitle>
                <Button className="ml-auto" variant="secondary">
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid gap-1">
                  <strong>{order.client.name}</strong>
                  <span>Total de pedidos (23)</span>
                </div>
              </CardContent>
            </div>
            <Separator />
            <div>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid gap-1">
                  <p>{order.client.email}</p>
                  <div className="text-gray-500 dark:text-gray-400">
                    +1 888 8888 8888
                  </div>
                </div>
              </CardContent>
            </div>
            <Separator />
            <div>
              <CardHeader>
                <CardTitle>Entrega</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div>
                  Sophia Anderson
                  <br />
                  1234 Main St.
                  <br />
                  Anytown, CA 12345
                </div>
              </CardContent>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center">
                <div>Subtotal</div>
                <Price
                  amount={subTotal.toString()}
                  currencyCode="BRL"
                  className="ml-auto"
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </div>
              <div className="flex items-center">
                <div>Taxas</div>
                <Price
                  amount={(2.8).toString()}
                  currencyCode="BRL"
                  className="ml-auto"
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </div>
              <Separator />
              <div className="flex items-center font-medium">
                <div>Total</div>
                <Price
                  amount={total.toString()}
                  currencyCode="BRL"
                  className="ml-auto"
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Badge variant="secondary" className="rounded-lg px-3 py-2">
                Pago
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
