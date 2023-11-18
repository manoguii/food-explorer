import { PromotionsSectionSlide } from './promotions-section-slides'
import { SearchInput } from './search-input'
import { FeaturedDishesSection } from './featured-dishes-section'
import Navigation from './navigation'
import DishesList from './dishes-list'

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    category?: string
    query?: string
    page?: string
  }
}) {
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
    <main className="relative mx-auto w-full space-y-8">
      <FeaturedDishesSection />

      <section className="space-y-4">
        <h2 className="mb-4 text-xl font-bold text-primary">Pra você</h2>
        <PromotionsSectionSlide />
      </section>

      <section className="flex flex-col gap-8">
        <Navigation />
        <SearchInput />

        <DishesList
          mode={mode}
          query={query}
          category={category}
          currentPage={currentPage}
        />
      </section>
    </main>
  )
}
