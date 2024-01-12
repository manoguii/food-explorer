import { fetchOrders } from '@/db/fetch'

import { Layout } from '@/components/layout'
import { DataTable } from '@/components/table/data-table'

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
