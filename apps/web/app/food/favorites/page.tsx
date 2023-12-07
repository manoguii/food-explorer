import { Suspense } from 'react'

import { FavoritesDishesList } from '@/components/favorites-dishes-list'
import { Layout } from '@/components/layout'
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
    <Layout>
      <Layout.Title>Meus favoritos</Layout.Title>

      <Suspense key={currentPage} fallback={<CardsSkeleton favoriteCard />}>
        <FavoritesDishesList currentPage={currentPage} />
      </Suspense>
    </Layout>
  )
}
