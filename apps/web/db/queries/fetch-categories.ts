import { unstable_cache } from 'next/cache'

import { Category } from '@/lib/types/definitions'

import { TAGS } from '../constants'
import { fetcher } from '../utils'

export type FetchCategoriesResponse = {
  categories: Category[]
  totalPages: number
}

async function fetchCategoriesData() {
  const endpoint = '/categories'
  const categories = await fetcher<FetchCategoriesResponse>(endpoint)

  return categories
}

export const fetchCategories = unstable_cache(
  fetchCategoriesData,
  [TAGS.categories],
  {
    tags: [TAGS.categories],
  },
)
