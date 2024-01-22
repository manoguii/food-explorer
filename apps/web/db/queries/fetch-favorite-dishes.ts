import { DishWithDetails } from '@/lib/types/definitions'

import { TAGS } from '../constants'
import { fetcher } from '../utils'

export type FetchFavoriteDishesResponse = {
  favoriteDishes: DishWithDetails[]
  totalPages: number
}

export async function fetchFavoriteDishes(page: number) {
  const endpoint = `/dish/favorites?page=${page}`

  const favoriteDishes = await fetcher<FetchFavoriteDishesResponse>(endpoint, {
    next: {
      tags: [TAGS.favorites],
    },
  })

  return favoriteDishes
}
