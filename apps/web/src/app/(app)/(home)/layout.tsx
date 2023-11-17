import React from 'react'
import { CategoriesNav } from './categories-nav'
import {
  fetchCategories,
  fetchDishesByCategory,
  fetchFavoriteDishes,
} from '@/lib/data'
import { getAuthToken } from '@/app/actions'
import { SectionForYou } from './section-for-you'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { SearchInput } from './search-input'
import { FeaturedDishes } from './featured-dish'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAuthToken()
  const [categories, { dishes }, favoriteDishes] = await Promise.all([
    fetchCategories(token),
    fetchDishesByCategory(token, 'Sobremesas'),
    fetchFavoriteDishes(token),
  ])

  const allItems = dishes.map((dish) => ({
    ...dish,
    isFavorite: favoriteDishes.some((item) => item.id === dish.id),
  }))

  return (
    <main className="relative mx-auto w-full space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-bold text-primary">
          Pratos em destaque
        </h2>
        <FeaturedDishes dishes={allItems} />
      </section>

      <section className="space-y-4">
        <h2 className="mb-4 text-xl font-bold text-primary">Pra você</h2>
        <SectionForYou />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CategoriesNav categories={categories} />
          <Button variant="outline" size="sm" className="ml-auto lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>

        <SearchInput />

        {children}
      </section>
    </main>
  )
}
