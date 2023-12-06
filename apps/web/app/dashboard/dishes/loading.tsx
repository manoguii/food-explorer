import { DishCreateButton } from '@/components/buttons/dish-create-button'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'

export default function DishesLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pratos"
        text="Crie e gerencie os pratos do restaurante."
      >
        <DishCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <p>Carregando pratos...</p>
      </div>
    </DashboardShell>
  )
}
