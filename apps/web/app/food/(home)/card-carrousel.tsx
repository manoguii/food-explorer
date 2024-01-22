import { fetchDishes } from '@/db/queries/fetch-dishes'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { DishCard } from '../../../components/food/dish-card'

export async function CardCarousel() {
  const { dishes } = await fetchDishes({
    page: 1,
    query: '',
  })

  return (
    <Carousel>
      <CarouselContent>
        {dishes.map((dish) => (
          <CarouselItem className="sm:basis-1/2 lg:basis-1/4" key={dish.id}>
            <DishCard dish={dish} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export function CardCarouselSkeleton() {
  const skeletonDishesQuantity = Array.from({ length: 4 })

  return (
    <div className="flex gap-4">
      {skeletonDishesQuantity.map((_, index) => (
        <div className="basis-1/4" key={index}>
          <DishCard.Skeleton />
        </div>
      ))}
    </div>
  )
}
