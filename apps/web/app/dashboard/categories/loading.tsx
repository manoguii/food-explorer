import { CategoryItem } from '@/components/cards'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'
import { CreateCategory } from '@/components/forms/dialog/create-category'

export default function CategoriesLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategory />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
