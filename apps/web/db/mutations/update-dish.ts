'use server'

import { z } from 'zod'

import { fetcher } from '../utils'

const editDishSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  ingredients: z.array(z.string()),
  categoryId: z.string().uuid(),
  attachmentsIds: z.array(z.string().uuid()),
})

type EditDishType = z.infer<typeof editDishSchema>

export async function updateDish(dish: EditDishType) {
  try {
    await fetcher(`/dishes/${dish.id}`, {
      method: 'PUT',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao atualizar prato.')
  }
}
