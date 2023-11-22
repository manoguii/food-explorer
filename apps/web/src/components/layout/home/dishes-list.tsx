import { fetchDishes, fetchDishesByCategory } from '@/lib/data'
import { getAuthToken } from '@/app/actions'
import { DishCard } from '@/components/cards/dish-card'
import { Pagination } from '@/components/pagination'
import { Dish } from '@/lib/types/definitions'
import Grid from '@/components/grid'

export default async function DishesList({
  mode,
  currentPage,
  query,
  category,
}: {
  mode: 'start' | 'search' | 'category'
  currentPage: number
  query: string
  category: string
}) {
  const token = await getAuthToken()

  let decodedCategoryParam: string
  let items: {
    dishes: Dish[]
    totalPages: number
  }

  switch (mode) {
    case 'start':
      items = await fetchDishes(token, {
        page: currentPage,
        query: '',
      })

      break
    case 'search':
      items = await fetchDishes(token, {
        page: currentPage,
        query,
      })

      break
    case 'category':
      decodedCategoryParam = decodeURIComponent(category)

      items = await fetchDishesByCategory(
        token,
        decodedCategoryParam,
        currentPage,
      )
      break
  }

  return (
    <>
      <Grid className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.dishes.map((dish) => (
          <Grid.Item className="!aspect-auto" key={dish.id}>
            <DishCard dish={dish} isFavorite={dish.isFavorite} />
          </Grid.Item>
        ))}
      </Grid>

      <Pagination totalPages={items.totalPages} />
    </>
  )
}
