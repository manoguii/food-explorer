import { fetchDishesByCategory } from '@/lib/data'
import { CarouselList } from '@/app/food/(home)/carousel'

import { PrimaryCard } from '../../../components/cards'
import { Skeleton } from '../../../components/ui/skeleton'

export async function SlideOfCards() {
  const [{ dishes: salads }, { dishes: meals }, { dishes: desserts }] =
    await Promise.all([
      fetchDishesByCategory('Saladas', 1),
      fetchDishesByCategory('Refeições', 1),
      fetchDishesByCategory('Sobremesas', 1),
    ])

  const dishes = [
    { dishes: meals, category: 'Saladas' },
    { dishes: salads, category: 'Refeições' },
    { dishes: desserts, category: 'Sobremesas' },
  ]

  return (
    <div className="space-y-14">
      {dishes.map(({ dishes, category }) => (
        <CarouselList key={category} dishes={dishes} category={category} />
      ))}
    </div>
  )
}

export function SlideOfCardsSkeleton() {
  const skeletonDishesQuantity = Array.from({ length: 4 })

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-48" />

        <div className="flex gap-2">
          <Skeleton className="ml-auto h-10 w-10" />
          <Skeleton className="ml-auto h-10 w-10" />
        </div>
      </div>
      <div className="react-multi-carousel-list">
        {skeletonDishesQuantity.map((_, i) => (
          <div
            key={i}
            className="react-multi-carousel-item react-multi-carousel-item--active px-3"
          >
            <PrimaryCard.Skeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
