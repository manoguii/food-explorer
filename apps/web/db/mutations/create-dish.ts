'use server'

import { z } from 'zod'

import { fetcher } from '../utils'

const createDishSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categoryId: z.string(),
  ingredients: z.array(z.string()),
  attachmentsIds: z.array(z.string().uuid()),
})

type CreateDishType = z.infer<typeof createDishSchema>

export async function createDish(dish: CreateDishType) {
  try {
    await fetcher('/dishes', {
      method: 'POST',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao criar prato.')
  }
}
