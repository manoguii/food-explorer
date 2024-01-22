'use server'

import { fetcher } from '../utils'

export async function deleteCategory(categoryId: string) {
  try {
    await fetcher(`/categories/${categoryId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover categoria.')
  }
}
