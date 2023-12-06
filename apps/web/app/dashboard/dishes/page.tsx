import { DishCreateButton } from '@/components/buttons/dish-create-button'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'

export default async function DishesPage() {
  // const { dishes, totalPages } = await fetchDishes()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pratos"
        text="Crie e gerencie os pratos do restaurante."
      >
        <DishCreateButton />
      </DashboardHeader>

      <div></div>
    </DashboardShell>
  )
}
