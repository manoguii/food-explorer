import { fetchOrders } from '@/lib/data'
import { Layout } from '@/components/layout'

import { columns } from './table/columns'
import { DataTable } from './table/data-table'

export default async function OrdersPage() {
  const { orders } = await fetchOrders()

  const data = orders.map((order) => ({
    ...order,
    title: order.details,
    id: order.code,
    priority: order.priority.toLowerCase(),
  }))

  return (
    <Layout>
      <Layout.Header
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <div>
        <DataTable data={data} columns={columns} />
      </div>
    </Layout>
  )
}
