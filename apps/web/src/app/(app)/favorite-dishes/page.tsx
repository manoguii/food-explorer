import { getAuthToken } from '@/app/actions'
import { FavoriteCard } from '@/components/cards'
import { fetchFavoriteDishes } from '@/lib/data'

export default async function FavoriteDishes() {
  const token = await getAuthToken()
  const favoriteDishes = await fetchFavoriteDishes(token)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Meus favoritos</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favoriteDishes.map((dish) => (
          <FavoriteCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  )
}
