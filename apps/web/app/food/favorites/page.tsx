import { Suspense } from 'react'

import { FavoritesDishesList } from '@/components/favorites-dishes-list'
import { FoodLayout } from '@/components/food-layout'
import { CardsSkeleton } from '@/components/skeletons'

export default async function FavoriteDishes({
  searchParams,
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1

  return (
    <FoodLayout>
      <FoodLayout.Title>Meus favoritos</FoodLayout.Title>

      <Suspense key={currentPage} fallback={<CardsSkeleton favoriteCard />}>
        <FavoritesDishesList currentPage={currentPage} />
      </Suspense>
    </FoodLayout>
  )
}
