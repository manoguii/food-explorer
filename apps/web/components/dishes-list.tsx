import { fetchDishes, fetchDishesByCategory } from '@/lib/data'
import { Dish } from '@/lib/types/definitions'
import { DishCard } from '@/components/cards'
import Grid from '@/components/grid'
import { Pagination } from '@/components/pagination'

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
  let decodedCategoryParam: string
  let items: {
    dishes: Dish[]
    totalPages: number
  }

  switch (mode) {
    case 'start':
      items = await fetchDishes({
        page: currentPage,
        query: '',
      })

      break
    case 'search':
      items = await fetchDishes({
        page: currentPage,
        query,
      })

      break
    case 'category':
      decodedCategoryParam = decodeURIComponent(category)

      items = await fetchDishesByCategory(decodedCategoryParam, currentPage)
      break
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <Grid className="mb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.dishes.map((dish) => (
          <Grid.Item key={dish.id} className="animate-fadeIn">
            <DishCard dish={dish} />
          </Grid.Item>
        ))}
      </Grid>

      <Pagination totalPages={items.totalPages} />
    </div>
  )
}
