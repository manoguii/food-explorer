import { DishCreateButton } from '@/components/buttons/dish-create-button'
import { DishItem } from '@/components/cards'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Pratos" text="Crie e gerencie seus pratos.">
        <DishCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <DishItem.Skeleton />
        <DishItem.Skeleton />
        <DishItem.Skeleton />
        <DishItem.Skeleton />
        <DishItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
