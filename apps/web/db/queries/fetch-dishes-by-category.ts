import { DishWithDetails } from '@/lib/types/definitions'

import { fetcher } from '../utils'

export type FetchDishesResponse = {
  dishes: DishWithDetails[]
  totalPages: number
}

export async function fetchDishesByCategory(category: string, page: number) {
  const endpoint = `/dish/${category}?page=${page}`
  const dishes = await fetcher<FetchDishesResponse>(endpoint, {})

  return dishes
}
