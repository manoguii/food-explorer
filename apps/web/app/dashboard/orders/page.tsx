import { fetchOrders } from '@/lib/data'
import { Layout } from '@/components/layout'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export default async function OrdersPage() {
  const { orders } = await fetchOrders()

  return (
    <Layout>
      <Layout.Header
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <DataTable data={orders} columns={columns} />
    </Layout>
  )
}
