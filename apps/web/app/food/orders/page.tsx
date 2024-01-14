import { Layout } from '@/components/layout'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export default async function Orders() {
  // const { orders, totalPages } = await fetchOrders()

  return (
    <Layout>
      <Layout.Title>Pedidos</Layout.Title>

      <DataTable totalPages={1} data={[]} columns={columns} />
    </Layout>
  )
}
