'use server'

import { fetcher } from '../utils'

export async function deleteDish(dishId: string) {
  try {
    await fetcher(`/dishes/${dishId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover prato.')
  }
}
