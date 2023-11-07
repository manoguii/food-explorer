'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CreateDishFormValues, createDishFormSchema } from '@/lib/schemas'
import { AttachField } from './fields/attach-field'
import { NameField } from './fields/name-field'
import { CategoryField } from './fields/category-field'
import { IngredientsField } from './fields/ingredients-field'
import { PriceField } from './fields/price-field'
import { DescriptionField } from './fields/description-field'
import { Category } from '@/lib/types/definitions'
import { toast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'

const defaultValues: Partial<CreateDishFormValues> = {
  description: '',
  name: '',
  price: '',
  category: '',
  ingredients: [{ value: 'Batata' }, { value: 'Arroz' }, { value: 'Feijão' }],
}

export function CreateDishForm({
  categories,
  token,
}: {
  categories: Category[]
  token: string
}) {
  const form = useForm<CreateDishFormValues>({
    resolver: zodResolver(createDishFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  async function handleCreateDish(data: CreateDishFormValues) {
    const formData = new FormData()
    formData.append('file', data.file)

    const response = await fetch('http://localhost:3333/attachments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const attachmentResponse = await response.json()

    const attachmentId = attachmentResponse.attachmentId
    const ingredients = data.ingredients.map((ingredient) => ingredient.value)
    const categoryId = categories.find(
      (category) => category.name === data.category,
    )?.id
    const price = Number(data.price.replace(',', ''))

    const dish = {
      name: data.name,
      description: data.description,
      price,
      ingredients,
      categoryId,
      attachmentsIds: [attachmentId],
    }

    const dishResponse = await fetch('http://localhost:3333/dishes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dish),
    })

    form.reset()

    if (dishResponse.ok) {
      toast({
        title: 'Prato criado com sucesso !',
        description: 'Seu prato foi criado com sucesso !',
      })
    } else {
      toast({
        title: 'Erro ao criar prato !',
        description:
          'Ocorreu um erro ao criar seu prato, tente novamente mais tarde !',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDish)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          <NameField />
          <AttachField />
          <CategoryField categories={categories} />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <IngredientsField />
          <PriceField />
        </div>

        <DescriptionField />

        <div className="flex items-end justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Criar prato
          </Button>
        </div>
      </form>
    </Form>
  )
}
