import DishesList from '../../../components/layout/home/dishes-list'
import { Suspense } from 'react'
import { CardsSkeleton } from '@/components/skeletons'
import { fetchCategories } from '@/lib/data'
import { getAuthToken } from '@/app/actions'
import { CategoriesNav } from '@/components/layout/home/categories-nav'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { SearchInput } from '@/components/search-input'
import { PromotionsSection } from '@/components/layout/home/promotions'

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    category?: string
    query?: string
    page?: string
  }
}) {
  const token = await getAuthToken()
  const { categories } = await fetchCategories(token)
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
    <main className="mx-auto w-full space-y-4">
      <PromotionsSection />
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CategoriesNav categories={categories} />
          <Button variant="outline" size="sm" className="ml-auto lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>

        <SearchInput />

        <Suspense
          key={query + currentPage + category}
          fallback={<CardsSkeleton />}
        >
          <DishesList
            mode={mode}
            query={query}
            category={category}
            currentPage={currentPage}
          />
        </Suspense>
      </section>
    </main>
  )
}
