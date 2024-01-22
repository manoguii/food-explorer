'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { TAGS } from '../constants'
import { fetcher } from '../utils'

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(3, {
      message: 'A categoria deve ter pelo menos 3 caractere.',
    })
    .max(20, {
      message: 'A categoria deve ter no máximo 20 caracteres.',
    }),
})

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
