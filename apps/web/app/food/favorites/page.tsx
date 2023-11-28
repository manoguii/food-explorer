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
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Meus favoritos</h1>

      <Suspense key={currentPage} fallback={<CardsSkeleton favoriteCard />}>
        <FavoritesDishesList currentPage={currentPage} />
      </Suspense>
    </div>
  )
}
