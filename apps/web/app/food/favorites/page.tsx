import Link from "next/link"

import { fetchFavoriteDishes } from "@/lib/data"
import { DishCard } from "@/components/cards"
import Grid from "@/components/grid"
import { Pagination } from "@/components/pagination"
import { getAuthToken } from "@/app/actions"

export default async function FavoriteDishes({
  searchParams,
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1

  const token = await getAuthToken()
  const { favoriteDishes, totalPages } = await fetchFavoriteDishes(
    token,
    currentPage
  )

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Meus favoritos</h1>

      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteDishes.map((dish) => {
          return (
            <Grid.Item key={dish.id} className="animate-fadeIn">
              <Link
                className="relative h-full w-full"
                href={`/food/dish/${dish.slug}`}
              >
                <DishCard dish={{ ...dish, isFavorite: true }} />
              </Link>
            </Grid.Item>
          )
        })}
      </Grid>

      <Pagination totalPages={totalPages} />
    </div>
  )
}
