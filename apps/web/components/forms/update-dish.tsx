'use client'

import * as React from 'react'
import * as Field from './fields'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { UpdateDishFormValues, updateDishFormSchema } from '@/lib/schemas'
import { Category, Dish } from '@/lib/types/definitions'
import { toast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { updateDish, uploadFile } from '@/app/actions'

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
      const formData = new FormData()
      formData.append('file', data.file)

      setUploadingFile({
        state: 'uploading',
      })

      const result = await uploadFile(formData)

      if (!result.success) {
        setUploadingFile({
          state: 'error',
        })

        return toast({
          title: `Error ao fazer upload das imagens !`,
          description: result.message,
          variant: 'destructive',
        })
      }

      setUploadingFile({
        state: 'success',
      })

      const attachmentId = result.attachmentId

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

    const result = await updateDish(dish)

    form.reset()

    if (result.success) {
      toast({
        title: 'Prato atualizado com sucesso !',
        description: result.message,
      })
    } else {
      toast({
        title: `Error ao atualizar o prato ${dish.name} !`,
        description: result.message,
        variant: 'destructive',
      })
    }

    if (currentDish.name !== data.name) {
      router.replace(`/app`)
    } else {
      router.replace(`/dish/${currentDish.slug}`)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateDish)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          <Field.Name
            placeholder="Salada de frutas"
            description="Digite o novo nome do prato."
          />
          <Field.File state={uploadingFile.state} />
          <Field.Category
            categories={categories}
            currentCategory={currentDish.category}
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Field.Ingredients type="update" />
          <Field.Price />
        </div>

        <Field.Description />
        <div className="flex items-end justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Editar prato
          </Button>
        </div>
      </form>
    </Form>
  )
}
