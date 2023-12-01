import { fetchFavoriteDishes } from '@/lib/data'
import { DishCard } from '@/components/cards'
import Grid from '@/components/grid'
import { Pagination } from '@/components/pagination'

export async function FavoritesDishesList({
  currentPage,
}: {
  currentPage: number
}) {
  const { favoriteDishes, totalPages } = await fetchFavoriteDishes(currentPage)

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteDishes.map((dish) => {
          return (
            <Grid.Item key={dish.id} className="animate-fadeIn">
              <DishCard dish={{ ...dish, isFavorite: true }} favoriteCard />
            </Grid.Item>
          )
        })}
      </Grid>

      <Pagination totalPages={totalPages} />
    </div>
  )
}
