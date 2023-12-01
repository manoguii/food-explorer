import { Suspense } from "react"

import FavoritesDishesList from "@/components/favorites-dishes-list"
import { CardsSkeleton } from "@/components/skeletons"

export default async function FavoriteDishes({
  searchParams,
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1

  return (
    <div className="flex min-h-[calc(100vh-72px-40px)] w-full flex-col">
      <h1 className="mb-4 text-2xl font-semibold">Meus favoritos</h1>

      <Suspense key={currentPage} fallback={<CardsSkeleton favoriteCard />}>
        <FavoritesDishesList currentPage={currentPage} />
      </Suspense>
    </div>
  )
}
