import { fetchOrders } from '@/lib/data'
import { FoodLayout } from '@/components/food-layout'
import { columns } from '@/app/food/orders/table/columns'
import { DataTable } from '@/app/food/orders/table/data-table'

export default async function Orders() {
  const tasks = await fetchOrders()

  const data = tasks.orders.map((order) => ({
    ...order,
    title: order.details,
    id: order.code,
    priority: order.priority.toLowerCase(),
  }))

  return (
    <FoodLayout>
      <FoodLayout.Title>Pedidos</FoodLayout.Title>

      <DataTable data={data} columns={columns} />
    </FoodLayout>
  )
}
