import { Suspense } from 'react'
import { fetchCategories } from '@/db/fetch'

import { CategoryCard } from '@/components/dashboard/category-card'
import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Pagination } from '@/components/pagination'
import { PaginationSkeleton } from '@/components/skeletons'

export default function CategoriesPage() {
  return (
    <Dashboard>
      <Dashboard.Header
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategory />
      </Dashboard.Header>

      <Suspense
        fallback={
          <Dashboard.Content>
            <div className="divide-border-200 divide-y rounded-md border">
              <CategoryCard.Skeleton />
              <CategoryCard.Skeleton />
              <CategoryCard.Skeleton />
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
