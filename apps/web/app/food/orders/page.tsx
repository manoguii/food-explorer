import { fetchOrders } from '@/lib/data'
import { getAuthToken } from '@/app/actions'
import { DataTable } from '@/app/food/orders/table/data-table'
import { columns } from '@/app/food/orders/table/columns'

export default async function Orders() {
  const token = await getAuthToken()
  const tasks = await fetchOrders(token)

  const data = tasks.orders.map((order) => ({
    ...order,
    title: order.details,
    id: order.code,
    priority: order.priority.toLowerCase(),
  }))

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Pedidos</h1>

      <DataTable data={data} columns={columns} />
    </div>
  )
}
