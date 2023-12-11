import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import { fetchOrders } from '@/lib/data'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export default async function OrderDetails() {
  const { orders } = await fetchOrders()

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
        <h1 className="text-lg font-semibold md:text-xl">
          #3102 -{' '}
          <span className="font-normal text-gray-500 dark:text-gray-400">
            Sophia Anderson
          </span>
          <span className="font-normal text-gray-500 dark:text-gray-400">
            on June 23, 2022
          </span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
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
          <DataTable
            data={orders.slice(0, 3)}
            columns={columns}
            whitPagination={false}
            whitToolbar={false}
          />
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
                  <strong>Sophia Anderson</strong>
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
                  <Link className="text-blue-600" href="#">
                    sophia@example.com
                  </Link>
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
                <div className="ml-auto">$35.00</div>
              </div>
              <div className="flex items-center">
                <div>Taxas</div>
                <div className="ml-auto">$2.80</div>
              </div>
              <Separator />
              <div className="flex items-center font-medium">
                <div>Total</div>
                <div className="ml-auto">$37.80</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button size="sm">Action (1)</Button>
              <Button size="sm" variant="outline">
                Action (2)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
