import { getAuthToken } from '@/app/actions'
import { DishCard } from '@/components/cards/dish-card'
import { Pagination } from '@/components/pagination'
import {
  fetchDishes,
  fetchDishesByCategory,
  fetchFavoriteDishes,
} from '@/lib/data'
import { Dish } from '@/lib/types/definitions'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params?: {
    category?: string
  }
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const token = await getAuthToken()

  let items: Dish[]
  let pages: number

  if (searchParams?.query) {
    const [{ dishes, totalPages }, { favoriteDishes }] = await Promise.all([
      fetchDishes(token, {
        page: currentPage,
        query,
      }),
      fetchFavoriteDishes(token, currentPage),
    ])

    items = dishes.map((dish) => ({
      ...dish,
      isFavorite: favoriteDishes.some((item) => item.id === dish.id),
    }))

    pages = totalPages
  } else if (
    params?.category &&
    params.category !== 'favicon.ico' &&
    params.category !== 'inicio'
  ) {
    const decodedParam = decodeURIComponent(params.category)
    const [{ dishes, totalPages }, { favoriteDishes }] = await Promise.all([
      fetchDishesByCategory(token, decodedParam, currentPage),
      fetchFavoriteDishes(token, currentPage),
    ])

    items = dishes.map((dish) => ({
      ...dish,
      isFavorite: favoriteDishes.some((item) => item.id === dish.id),
    }))

    pages = totalPages
  } else {
    const [{ dishes, totalPages }, { favoriteDishes }] = await Promise.all([
      fetchDishes(token, {
        page: currentPage,
        query: '',
      }),
      fetchFavoriteDishes(token, currentPage),
    ])

    items = dishes.map((dish) => ({
      ...dish,
      isFavorite: favoriteDishes.some((item) => item.id === dish.id),
    }))

    pages = totalPages
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((dish) => (
          <DishCard key={dish.id} dish={dish} isFavorite={dish.isFavorite} />
        ))}
      </div>

      <Pagination totalPages={pages} />
    </>
  )
}
