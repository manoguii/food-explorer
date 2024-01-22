import { DishWithDetails } from '@/lib/types/definitions'

import { fetcher } from '../utils'

export type GetDishBySlugResponse = {
  dish: DishWithDetails
}

export async function getDishBySlug(slug: string) {
  const endpoint = `/dishes/${slug}`
  const { dish } = await fetcher<GetDishBySlugResponse>(endpoint)

  return dish
}
