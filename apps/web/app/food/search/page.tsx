import { Suspense } from 'react'

import { fetchCategories } from '@/lib/data'
import { FacetedFilter } from '@/components/faceted-filter'
import { Layout } from '@/components/layout'
import { DashboardSearchInput } from '@/components/search-input'

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
      <div className="flex items-center gap-4">
        <DashboardSearchInput />
        <FacetedFilter title="Categorias" options={categories} />
      </div>

      {query && (
        <p className="font-medium text-muted-foreground">
          Resultados para <span className="text-primary">{`"${query}"`}</span>
        </p>
      )}

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
