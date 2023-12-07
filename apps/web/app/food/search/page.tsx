import { Suspense } from 'react'

import { fetchCategories } from '@/lib/data'
import { CategoriesNav } from '@/components/categories-nav'
import { Layout } from '@/components/layout'

import {
  ListSearchedDishes,
  PrimaryCardListSkeleton,
} from './list-searched-dishes'

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    category?: string
    query?: string
    page?: string
  }
}) {
  const { categories } = await fetchCategories()

  const query = searchParams?.query || ''
  const category = searchParams?.category || ''
  const currentPage = Number(searchParams?.page) || 1

  let mode: 'start' | 'search' | 'category'

  if (query) {
    mode = 'search'
  } else if (category) {
    mode = 'category'
  } else {
    mode = 'start'
  }

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        {query && (
          <p className="font-medium text-secondary-foreground">
            Resultados para <span>{`"${query}"`}</span>
          </p>
        )}

        <CategoriesNav categories={categories} />
      </div>

      <Suspense
        key={query + currentPage + category}
        fallback={<PrimaryCardListSkeleton />}
      >
        <ListSearchedDishes
          mode={mode}
          query={query}
          category={category}
          currentPage={currentPage}
        />
      </Suspense>
    </Layout>
  )
}
