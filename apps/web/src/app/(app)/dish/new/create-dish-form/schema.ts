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
  file: z.string().refine(
    (value) => {
      return (
        value.endsWith('.jpg') ||
        value.endsWith('.jpeg') ||
        value.endsWith('.png')
      )
    },
    {
      message: 'O arquivo deve ser uma imagem JPG ou PNG.',
    },
  ),
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

export type CreateDishFormValues = z.infer<typeof createDishFormSchema>

export const newCategoryFormSchema = z.object({
  category: z
    .string({
      required_error: 'The category name is required.',
    })
    .regex(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
      message: 'Use only letters and hyphens.',
    }),
})

export type NewCategoryFormSchema = z.infer<typeof newCategoryFormSchema>
