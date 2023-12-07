import Link from 'next/link'

import { fetchDishes } from '@/lib/data'
import { Dish } from '@/lib/types/definitions'
import Grid from '@/components/grid'
import { Pagination } from '@/components/pagination'

import { Operations } from './operations'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export default async function ListManageDishes({
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
      <Grid className="mb-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {items.dishes.map((dish) => (
          <Grid.Item key={dish.id} className="animate-fadeIn">
            <Card className="h-full">
              <CardHeader className="flex flex-row justify-between gap-2">
                <div>
                  <Link
                    href={`/editor/${dish.slug}`}
                    className="font-semibold hover:underline"
                  >
                    <CardTitle className="text-lg">{dish.name}</CardTitle>
                  </Link>
                  <CardDescription className="!mt-0">
                    {dish.description}
                  </CardDescription>
                </div>
                <Operations
                  item={{
                    id: dish.id,
                    name: dish.name,
                  }}
                  entity="dish"
                />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-1">
                  {dish.ingredients.map((item) => {
                    return (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </Grid.Item>
        ))}
      </Grid>

      <Pagination totalPages={items.totalPages} />
    </div>
  )
}
