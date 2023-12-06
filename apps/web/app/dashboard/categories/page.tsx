import { fetchCategories } from '@/lib/data'
import { CategoryItem } from '@/components/cards'
import { DashboardHeader, DashboardShell } from '@/components/dashboard-layout'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Pagination } from '@/components/pagination'

export default async function CategoriesPage() {
  const { categories, totalPages } = await fetchCategories()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategory />
      </DashboardHeader>
      <div>
        {categories?.length ? (
          <div className="grid gap-4">
            <div className="divide-y divide-border rounded-md border">
              {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>

            <Pagination totalPages={totalPages} />
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="logo" />
            <EmptyPlaceholder.Title>
              Nenhuma categoria encontrada
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Crie uma nova categoria.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
