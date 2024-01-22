import { fetchDishes } from '@/db/queries/fetch-dishes'
import { fetchDishesByCategory } from '@/db/queries/fetch-dishes-by-category'

import { DishWithDetails } from '@/lib/types/definitions'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { DishCard } from '@/components/food/dish-card'
import { Grid } from '@/components/food/grid'
import { Pagination } from '@/components/pagination'
import { PaginationSkeleton } from '@/components/skeletons'

export async function ListSearchedDishes({
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
    dishes: DishWithDetails[]
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
      {items.dishes.length > 0 ? (
        <>
          <Grid className="mb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.dishes.map((dish) => (
              <Grid.Item key={dish.id} className="animate-fadeIn">
                <DishCard dish={dish} />
              </Grid.Item>
            ))}
          </Grid>

          <Pagination totalPages={items.totalPages} />
        </>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="logo" />
          <EmptyPlaceholder.Title>
            Nenhuma prato encontrado
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Nenhum resultado encontrado para{' '}
            <span className="text-primary">{`"${query}"`}</span>.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}

export function DishCardListSkeleton({
  favoriteCard = false,
}: {
  favoriteCard?: boolean
}) {
  const skeletonQuantity = Array.from({ length: 6 })

  return (
    <>
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skeletonQuantity.map((_, i) => (
          <Grid.Item key={i}>
            <DishCard.Skeleton favoriteCard={favoriteCard} />
          </Grid.Item>
        ))}
      </Grid>

      <PaginationSkeleton />
    </>
  )
}
