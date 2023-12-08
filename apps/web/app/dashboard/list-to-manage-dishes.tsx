import { fetchDishes } from '@/lib/data'
import { Dish } from '@/lib/types/definitions'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { Grid } from '@/components/grid'
import { Pagination } from '@/components/pagination'
import { PaginationSkeleton } from '@/components/skeletons'

import { SecondaryCard } from '../../components/cards'

export async function ListToManageDishes({
  mode,
  currentPage,
  query,
}: {
  mode: 'all' | 'search'
  currentPage: number
  query: string
}) {
  let items: {
    dishes: Dish[]
    totalPages: number
  }

  switch (mode) {
    case 'all':
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
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      {items.dishes.length > 0 ? (
        <>
          <Grid className="mb-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {items.dishes.map((dish) => (
              <Grid.Item key={dish.id} className="animate-fadeIn">
                <SecondaryCard dish={dish} />
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
            Nenhum resultado encontrado para {`"${query}"`}.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}

export function ListToManageDishesSkeleton() {
  const skeletonQuantity = Array.from({ length: 9 })

  return (
    <>
      <Grid className="mb-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {skeletonQuantity.map((_, i) => (
          <Grid.Item key={i}>
            <SecondaryCard.Skeleton />
          </Grid.Item>
        ))}
      </Grid>

      <PaginationSkeleton />
    </>
  )
}
