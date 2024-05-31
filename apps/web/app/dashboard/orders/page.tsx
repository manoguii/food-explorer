import { Suspense } from 'react'

import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { DataTableSkeleton } from '@/components/skeletons'
import { DataTable } from '@/components/table/data-table'
import { fetchOrders } from '@/db/queries/fetch-orders'

import { columns } from './columns'

export default function OrdersPage() {
  return (
    <Dashboard>
      <Dashboard.Header
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />
      <Dashboard.Content>
        <Suspense fallback={<DataTableSkeleton />}>
          <DataTableWrapper />
        </Suspense>
      </Dashboard.Content>
    </Dashboard>
  )
}

async function DataTableWrapper() {
  const { orders, totalPages } = await fetchOrders()

  return <DataTable totalPages={totalPages} data={orders} columns={columns} />
}
