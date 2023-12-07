import { Suspense } from 'react'

import { Layout } from '@/components/layout'

import { PrimaryCardListSkeleton } from '../search/list-searched-dishes'
import { FavoritesDishesList } from './favorites-dishes-list'

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

      <Suspense
        key={currentPage}
        fallback={<PrimaryCardListSkeleton favoriteCard />}
      >
        <FavoritesDishesList currentPage={currentPage} />
      </Suspense>
    </Layout>
  )
}
