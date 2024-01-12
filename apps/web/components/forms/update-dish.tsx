'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { updateDish, uploadFile } from '@/db/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { updateDishFormSchema, UpdateDishFormValues } from '@/lib/schemas'
import { Category, Dish } from '@/lib/types/definitions'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

import { ButtonWithLoading } from '../buttons/button-with-loading'
import * as Field from './fields'

export function UpdateDishForm({
  currentDish,
  categories,
}: {
  currentDish: Dish
  categories: Category[]
}) {
  const [uploadingFile, setUploadingFile] = React.useState<{
    state: 'idle' | 'uploading' | 'success' | 'error'
  }>({
    state: 'idle',
  })

  const defaultValues: Partial<UpdateDishFormValues> = {
    description: currentDish.description,
    name: currentDish.name,
    price: currentDish.price.toString(),
    category: currentDish.category,
    ingredients: currentDish.ingredients.map((ingredient) => ({
      value: ingredient,
    })),
  }

  const router = useRouter()

  const form = useForm<UpdateDishFormValues>({
    resolver: zodResolver(updateDishFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  async function handleUpdateDish(data: UpdateDishFormValues) {
    let attachmentsIds = currentDish.attachments.map(
      (attachment) => attachment.id,
    )

    if (data.file) {
      let attachmentId = ''

      const formData = new FormData()
      formData.append('file', data.file)

      setUploadingFile({
        state: 'uploading',
      })

      try {
        attachmentId = await uploadFile(formData)
      } catch (error) {
        if (error instanceof Error) {
          setUploadingFile({
            state: 'error',
          })

          toast({
            title: 'Erro ao fazer upload da imagem',
            description: error.message,
            variant: 'destructive',
          })
        }
      }

      setUploadingFile({
        state: 'success',
      })

      attachmentsIds = [...attachmentsIds, attachmentId]
    }

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
      id: currentDish.id,
      slug: currentDish.slug,
      name: data.name,
      description: data.description,
      price: Number(data.price.replace(',', '')),
      ingredients: data.ingredients.map((ingredient) => ingredient.value),
      categoryId,
      attachmentsIds,
    }

    try {
      await updateDish(dish)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error !',
          description: error.message,
          variant: 'destructive',
        })
      }
    }

    form.reset()
    router.replace(`/dashboard/dishes`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateDish)}
        className="space-y-8"
      >
        <Field.Name
          placeholder="Salada de frutas"
          description="Digite o novo nome do prato."
        />

        <Field.Category
          categories={categories}
          currentCategory={currentDish.category}
        />
        <Field.Price />

        <Field.Ingredients type="update" />

        <Field.Description />

        <Field.File state={uploadingFile.state} />

        <div className="flex items-end justify-end">
          <ButtonWithLoading
            type="submit"
            icon="save"
            isLoading={form.formState.isSubmitting}
          >
            Salvar
          </ButtonWithLoading>
        </div>
      </form>
    </Form>
  )
}
