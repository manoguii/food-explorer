import { Suspense } from 'react'

import { FacetedFilter } from '@/components/faceted-filter'
import { Layout } from '@/components/food/layout'
import { DashboardSearchInput } from '@/components/search-input'
import { FacetedFilterSkeleton } from '@/components/skeletons'
import { fetchCategories } from '@/db/queries/fetch-categories'

import {
  DishCardListSkeleton,
  ListSearchedDishes,
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
      <div className="flex items-center gap-4">
        <DashboardSearchInput />

        <Suspense
          key={query + currentPage + category}
          fallback={<FacetedFilterSkeleton />}
        >
          <FacetedFilter title="Categorias" options={categories} />
        </Suspense>
      </div>

      <Suspense
        key={query + currentPage + category}
        fallback={<DishCardListSkeleton />}
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
