import { Suspense } from 'react'

import { fetchCategories } from '@/lib/data'
import { CategoryCard } from '@/components/cards'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Layout } from '@/components/layout'
import { Pagination } from '@/components/pagination'
import { PaginationSkeleton } from '@/components/skeletons'

export default async function CategoriesPage() {
  const { categories, totalPages } = await fetchCategories()

  return (
    <Layout>
      <Layout.Header
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategory />
      </Layout.Header>

      <div>
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
      </div>
    </Layout>
  )
}
