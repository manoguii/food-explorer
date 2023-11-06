import { z } from 'zod'

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

export type UserAuthFormValues = z.infer<typeof userAuthFormSchema>
export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
export type CreateDishFormValues = z.infer<typeof createDishFormSchema>
export type NewCategoryFormSchema = z.infer<typeof newCategoryFormSchema>
