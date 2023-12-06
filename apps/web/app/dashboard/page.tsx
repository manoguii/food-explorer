import { fetchDishes } from '@/lib/data'
import { DishCreateButton } from '@/components/buttons/dish-create-button'
import { DishItem } from '@/components/cards'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'
import { EmptyPlaceholder } from '@/components/empty-placeholder'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const { dishes } = await fetchDishes({
    page: 1,
    query: '',
  })

  console.log(dishes)

  return (
    <DashboardShell>
      <DashboardHeader heading="Pratos" text="Crie e gerencie seus pratos.">
        <DishCreateButton />
      </DashboardHeader>
      <div>
        {dishes?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {dishes.map((dish) => (
              <DishItem key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="logo" />
            <EmptyPlaceholder.Title>Nenhum prato criado</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Crie um novo prato para começar a vender.
            </EmptyPlaceholder.Description>

            <DishCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
