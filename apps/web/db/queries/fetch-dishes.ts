import { DishWithDetails } from '@/lib/types/definitions'

import { fetcher } from '../utils'

export type FetchDishesResponse = {
  dishes: DishWithDetails[]
  totalPages: number
}

export async function fetchDishes({
  page,
  query,
}: {
  page?: number
  query?: string
}): Promise<FetchDishesResponse> {
  const endpoint = `/dishes?page=${page}&query=${query}`
  const dishes = await fetcher<FetchDishesResponse>(endpoint)

  return dishes
}
