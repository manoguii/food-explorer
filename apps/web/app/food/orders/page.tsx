import { fetchOrders } from '@/lib/data'
import { Layout } from '@/components/layout'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export default async function Orders() {
  const { orders } = await fetchOrders()

  return (
    <Layout>
      <Layout.Title>Pedidos</Layout.Title>

      <DataTable data={orders} columns={columns} />
    </Layout>
  )
}
