import { z } from 'zod'

// valid orders schema
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

export const createDishFormSchema = z.object({
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
  price: z.string().min(2, {
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

export const updateDishFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Para atualizar o nome, ele deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'O nome deve ter no máximo 30 caracteres.',
    }),
  file: z
    .instanceof(File, {
      message: 'Selecione uma imagem para o prato.',
    })
    .optional(),
  price: z.string().min(2, {
    message: 'Digite um preço válido.',
  }),
  category: z.string().min(1, {
    message: 'Selecione uma categoria.',
  }),
  description: z
    .string()
    .min(4, {
      message: 'A descrição deve ter pelo menos 4 caracteres.',
    })
    .max(160, {
      message: 'A descrição deve ter no máximo 160 caracteres.',
    }),
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

export const newCategoryFormSchema = z.object({
  category: z
    .string({
      required_error: 'O nome da categoria é obrigatório.',
    })
    .regex(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
      message: 'Digite um nome de categoria válido.',
    }),
})

export const createAccountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'O nome deve ter no máximo 30 caracteres.',
    }),
  email: z.string().email({
    message: 'O email deve ser válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
})

export const userAuthFormSchema = z.object({
  email: z.string().email({
    message: 'O email deve ser válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
})

export const searchDishFormSchema = z.object({
  search: z.string(),
})

export type Task = z.infer<typeof taskSchema>
export type UserAuthFormValues = z.infer<typeof userAuthFormSchema>
export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
export type CreateDishFormValues = z.infer<typeof createDishFormSchema>
export type UpdateDishFormValues = z.infer<typeof updateDishFormSchema>
export type NewCategoryFormSchema = z.infer<typeof newCategoryFormSchema>
export type SearchDishFormValues = z.infer<typeof searchDishFormSchema>
