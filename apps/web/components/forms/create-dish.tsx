'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createDish, uploadFile } from '@/db/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { createDishFormSchema, CreateDishFormValues } from '@/lib/schemas'
import { Category } from '@/lib/types/definitions'
import * as Form from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

import { ButtonWithLoading } from '../buttons/button-with-loading'
import * as Field from './fields'

const defaultValues: Partial<CreateDishFormValues> = {
  description: '',
  name: '',
  price: '',
  category: '',
  ingredients: [{ value: 'Batata' }, { value: 'Arroz' }, { value: 'Feijão' }],
}

export function CreateDishForm({ categories }: { categories: Category[] }) {
  const [uploadingFile, setUploadingFile] = React.useState<{
    state: 'idle' | 'uploading' | 'success' | 'error'
  }>({
    state: 'idle',
  })

  const router = useRouter()

  const form = useForm<CreateDishFormValues>({
    resolver: zodResolver(createDishFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  async function handleCreateDish(data: CreateDishFormValues) {
    const formData = new FormData()
    formData.append('file', data.file)

    setUploadingFile({
      state: 'uploading',
    })

    let attachmentId = ''

    try {
      attachmentId = await uploadFile(formData)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error !',
          description: error.message,
          variant: 'destructive',
        })

        setUploadingFile({
          state: 'error',
        })

        return
      }
    }

    setUploadingFile({
      state: 'success',
    })

    const categoryId = categories.find(
      (category) => category.name === data.category,
    )?.id

    if (!categoryId) {
      return toast({
        title: 'Categoria não encontrada !',
        description: `A categoria ${data.category} não foi encontrada !`,
        variant: 'destructive',
      })
    }

    const dish = {
      name: data.name,
      description: data.description,
      price: Number(data.price.replace(',', '')),
      ingredients: data.ingredients.map((ingredient) => ingredient.value),
      categoryId,
      attachmentsIds: [attachmentId],
    }

    try {
      await createDish(dish)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error !',
          description: error.message,
          variant: 'destructive',
        })
      }
    } finally {
      form.reset()
      router.replace(`/dashboard/dishes`)
    }
  }

  return (
    <Form.Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDish)}
        className="space-y-8"
      >
        <Field.Name
          placeholder="Salada de frutas"
          description="Digite o nome do prato."
        />

        <Field.Category categories={categories} />

        <Field.Ingredients type="create" />
        <Field.Price />

        <Field.Description />

        <Field.File state={uploadingFile.state} />

        <div className="flex items-end justify-end">
          <ButtonWithLoading
            type="submit"
            icon="create"
            isLoading={form.formState.isSubmitting}
          >
            Criar prato
          </ButtonWithLoading>
        </div>
      </form>
    </Form.Form>
  )
}
