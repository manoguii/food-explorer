import { fetchFavoriteDishes } from '@/db/queries/fetch-favorite-dishes'

import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { DishCard } from '@/components/food/dish-card'
import { Grid } from '@/components/food/grid'
import { Pagination } from '@/components/pagination'

export async function FavoritesDishesList({
  currentPage,
}: {
  currentPage: number
}) {
  const { favoriteDishes, totalPages } = await fetchFavoriteDishes(currentPage)

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      {favoriteDishes.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteDishes.map((dish) => {
              return (
                <Grid.Item key={dish.id} className="animate-fadeIn">
                  <DishCard
                    dish={{ ...dish, isFavorite: true }}
                    withoutFooter
                  />
                </Grid.Item>
              )
            })}
          </Grid>

          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="logo" />
          <EmptyPlaceholder.Title>
            Voce ainda não favoritou nenhum prato.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Para favoritar um prato, basta clicar no ícone de coração no canto
            superior direito do card.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}
