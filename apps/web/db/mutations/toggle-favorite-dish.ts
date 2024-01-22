'use server'

import { revalidateTag } from 'next/cache'

import { TAGS } from '../constants'
import { fetcher } from '../utils'

export async function toggleFavoriteDish(
  prevState: unknown,
  item: {
    dishId: string
    isFavorite: boolean
  },
) {
  const { dishId, isFavorite } = item

  let errorMessage: string
  let method: 'PATCH' | 'DELETE'

  if (isFavorite) {
    errorMessage = 'Error ao remover prato dos favoritos.'
    method = 'DELETE'
  } else {
    errorMessage = 'Error ao favoritar prato.'
    method = 'PATCH'
  }

  try {
    await fetcher(`/dishes/${dishId}/favorite`, {
      method,
    })

    revalidateTag(TAGS.favorites)
    return 'Prato favoritado com sucesso.'
  } catch (error) {
    return errorMessage
  }
}
