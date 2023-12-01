'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'

import { createDishFormSchema, CreateDishFormValues } from '@/lib/schemas'
import { Category } from '@/lib/types/definitions'
import { Button } from '@/components/ui/button'
import * as Form from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { createDish, uploadFile } from '@/app/actions'

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

    const result = await uploadFile(formData)

    if (!result.success) {
      setUploadingFile({
        state: 'error',
      })

      return toast({
        title: 'Erro ao criar as imagens do prato !',
        description: result.message,
        variant: 'destructive',
      })
    }

    setUploadingFile({
      state: 'success',
    })

    const attachmentId = result.attachmentId

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

    const dishResult = await createDish(dish)

    form.reset()

    if (dishResult.success) {
      toast({
        title: 'Prato criado com sucesso !',
        description: dishResult.message,
      })
    } else {
      toast({
        title: 'Erro ao criar prato !',
        description: dishResult.message,
        variant: 'destructive',
      })
    }

    router.replace(`/app`)
  }

  return (
    <Form.Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDish)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          <Field.Name
            placeholder="Salada de frutas"
            description="Digite o nome do prato."
          />
          <Field.File state={uploadingFile.state} />
          <Field.Category categories={categories} />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Field.Ingredients type="create" />
          <Field.Price />
        </div>

        <Field.Description />
        <div className="flex items-end justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Criar prato
          </Button>
        </div>
      </form>
    </Form.Form>
  )
}
