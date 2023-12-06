import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'

export default async function OrdersPage() {
  // const { orders, totalPages } = await fetchOrders()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <div></div>
    </DashboardShell>
  )
}
