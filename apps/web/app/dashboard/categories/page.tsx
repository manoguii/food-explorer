import { Suspense } from 'react'

import { CategoryCard } from '@/components/dashboard/category-card'
import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { CreateCategoryForm } from '@/components/forms/create-category'
import { Pagination } from '@/components/pagination'
import { PaginationSkeleton } from '@/components/skeletons'
import { fetchCategories } from '@/db/queries/fetch-categories'

export default function CategoriesPage() {
  return (
    <Dashboard>
      <Dashboard.Header
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategoryForm />
      </Dashboard.Header>

      <Suspense
        fallback={
          <Dashboard.Content>
            <div className="grid gap-4">
              <div className="divide-border-200 divide-y rounded-md border">
                <CategoryCard.Skeleton />
                <CategoryCard.Skeleton />
                <CategoryCard.Skeleton />
              </div>
              <PaginationSkeleton />
            </div>
          </Dashboard.Content>
        }
      >
        <CategoriesWrapper />
      </Suspense>
    </Dashboard>
  )
}

async function CategoriesWrapper() {
  const { categories, totalPages } = await fetchCategories()
  await new Promise((resolve) => setTimeout(resolve, 4000))
  return (
    <Dashboard.Content>
      {categories?.length ? (
        <div className="grid gap-4">
          <div className="divide-y divide-border rounded-md border">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <Suspense
            key={'categories-pagination'}
            fallback={<PaginationSkeleton />}
          >
            <Pagination totalPages={totalPages} />
          </Suspense>
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
    </Dashboard.Content>
  )
}
