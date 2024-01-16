import { z } from 'zod'

export const dishFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'O nome deve ter no máximo 30 caracteres.',
    }),
  file: z.instanceof(File, {
    message: 'Selecione uma imagem para o prato.',
  }),
  price: z.string().min(1, {
    message: 'Digite um preço válido.',
  }),
  category: z.string().min(1, {
    message: 'Selecione uma categoria.',
  }),
  description: z.string().max(160).min(4),
  ingredients: z
    .array(
      z.object({
        value: z
          .string()
          .min(3, { message: 'Adicione um ingrediente valido !' }),
      }),
    )
    .min(3, { message: 'Adicione pelo menos 3 ingredientes.' }),
})

export const userAuthFormSchema = z.object({
  email: z.string().email({
    message: 'O email deve ser válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
})

export const createAccountFormSchema = userAuthFormSchema.extend({
  name: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'O nome deve ter no máximo 30 caracteres.',
    }),
})

export const searchDishFormSchema = z.object({
  search: z.string(),
})

export const taskSchema = z.object({
  id: z.string(),
  details: z.string(),
  code: z.string(),
  status: z.enum(['PENDING', 'PREPARING', 'DELIVERED', 'CANCELED']),
  label: z.enum(['TABLE', 'DELIVERY', 'TAKEOUT']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export const detailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string(),
  attachments: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
    }),
  ),
  quantity: z.number(),
  status: z.enum(['PENDING', 'PREPARING', 'DELIVERED', 'CANCELED']),
  orderId: z.string(),
})

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

export const updateCategorySchema = categorySchema.extend({
  id: z.string().uuid(),
})

export type Task = z.infer<typeof taskSchema>
export type Details = z.infer<typeof detailsSchema>

export type SearchDishFormValues = z.infer<typeof searchDishFormSchema>
export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
export type AuthFormValues = z.infer<typeof userAuthFormSchema>
export type DishFormValues = z.infer<typeof dishFormSchema>
