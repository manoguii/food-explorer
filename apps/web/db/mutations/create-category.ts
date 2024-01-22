'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { TAGS } from '../constants'
import { fetcher } from '../utils'

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'A categoria deve ter pelo menos 3 caractere.',
    })
    .max(20, {
      message: 'A categoria deve ter no máximo 20 caracteres.',
    }),
})

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
