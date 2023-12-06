import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'

export default function OrdersLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <div className="divide-border-200 divide-y rounded-md border">
        <p>Carregando pedidos...</p>
      </div>
    </DashboardShell>
  )
}
