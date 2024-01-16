'use server'

import { revalidateTag } from 'next/cache'
import { fetcher } from '@/db/utils'

import { categorySchema, updateCategorySchema } from '@/lib/schemas'
import {
  CreateDishParams,
  UpdateDishParams,
  UploadFileResponse,
} from '@/lib/types/definitions'

import { TAGS } from './constants'

export async function createCategory(prevState: unknown, formData: FormData) {
  const input = {
    name: formData.get('categoryName'),
  }
  const validation = categorySchema.safeParse(input)

  if (!validation.success) {
    return {
      message: validation.error.errors[0].message,
      success: false,
    }
  }

  try {
    await fetcher('/categories', {
      method: 'POST',
      body: JSON.stringify({ name: validation.data.name }),
    })

    revalidateTag(TAGS.categories)

    return {
      message: 'Categoria criada com sucesso.',
      success: true,
    }
  } catch (error) {
    return {
      message: 'Error ao criar categoria.',
      success: false,
    }
  }
}

export async function createDish(dish: CreateDishParams) {
  try {
    await fetcher('/dishes', {
      method: 'POST',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao criar prato.')
  }
}

export async function updateDish(dish: UpdateDishParams) {
  try {
    await fetcher(`/dishes/${dish.id}`, {
      method: 'PUT',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao atualizar prato.')
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const result = await fetcher<UploadFileResponse>('/attachments', {
      method: 'POST',
      body: formData,
    })

    const attachmentId = result.attachmentId

    return attachmentId
  } catch (error) {
    throw new Error('Error ao fazer upload do arquivo.')
  }
}

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

export async function updateCategory(prevState: unknown, formData: FormData) {
  const input = {
    id: formData.get('categoryId'),
    name: formData.get('categoryName'),
  }

  const validation = updateCategorySchema.safeParse(input)

  if (!validation.success) {
    return {
      message: validation.error.errors[0].message,
      success: false,
    }
  }

  const { id, name } = validation.data

  try {
    await fetcher(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    })

    revalidateTag(TAGS.categories)

    return {
      message: 'Categoria atualizada com sucesso.',
      success: true,
    }
  } catch (error) {
    throw new Error('Error ao atualizar categoria.')
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await fetcher(`/categories/${categoryId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover categoria.')
  }
}

export async function deleteDish(dishId: string) {
  try {
    await fetcher(`/dishes/${dishId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover prato.')
  }
}
