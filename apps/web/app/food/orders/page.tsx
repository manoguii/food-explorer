import { fetchOrders } from '@/lib/data'
import { Layout } from '@/components/layout'
import { columns } from '@/app/food/orders/table/columns'
import { DataTable } from '@/app/food/orders/table/data-table'

export default async function Orders() {
  const { orders } = await fetchOrders()

  const data = orders.map((order) => ({
    ...order,
    title: order.details,
    id: order.code,
    priority: order.priority.toLowerCase(),
  }))

  return (
    <Layout>
      <Layout.Title>Pedidos</Layout.Title>

      <DataTable data={data} columns={columns} />
    </Layout>
  )
}
