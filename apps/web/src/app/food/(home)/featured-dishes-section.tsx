import { getAuthToken } from '@/app/actions'
import { FeaturedDishes } from './featured-dish-slides'
import { fetchFavoriteDishes } from '@/lib/data'

export async function FeaturedDishesSection() {
  const token = await getAuthToken()
  const { favoriteDishes } = await fetchFavoriteDishes(token, 1)

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-primary">
        Pratos em destaque
      </h2>
      <FeaturedDishes dishes={favoriteDishes} />
    </section>
  )
}
