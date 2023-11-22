import { getAuthToken } from '@/app/actions'
import { FavoriteCard } from '@/components/cards/favorite-card'
import { Pagination } from '@/components/pagination'
import { fetchFavoriteDishes } from '@/lib/data'

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
    currentPage,
  )

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Meus favoritos</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favoriteDishes.map((dish) => (
          <FavoriteCard key={dish.id} dish={dish} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  )
}
