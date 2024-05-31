import { Layout } from '@/components/food/layout'
import { DataTable } from '@/components/table/data-table'
import { fetchOrders } from '@/db/queries/fetch-orders'

import { columns } from './columns'

export default async function Orders() {
  const { orders, totalPages } = await fetchOrders()

  return (
    <Layout>
      <Layout.Title>Pedidos</Layout.Title>

      <DataTable totalPages={totalPages} data={orders} columns={columns} />
    </Layout>
  )
}
