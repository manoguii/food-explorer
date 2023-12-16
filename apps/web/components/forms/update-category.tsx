'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  updateCategoryFormSchema,
  UpdateCategoryFormValues,
} from '@/lib/schemas'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { updateCategory } from '@/app/actions'

import { ButtonWithLoading } from '../buttons/button-with-loading'
import * as Field from './fields'

export function UpdateCategoryForm({
  category,
}: {
  category: {
    name: string
    id: string
  }
}) {
  const defaultValues: Partial<UpdateCategoryFormValues> = {
    category: category.name,
  }

  const router = useRouter()

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues,
  })

  async function handleUpdateCategory(data: UpdateCategoryFormValues) {
    const result = await updateCategory(category.id, {
      name: data.category,
    })

    form.reset()

    if (result.success) {
      toast({
        title: 'Categoria atualizada com sucesso!',
        description: result.message,
      })
    } else {
      toast({
        title: `Erro ao atualizar categoria ${category.name}!`,
        description: result.message,
        variant: 'destructive',
      })
    }

    router.push('/dashboard/categories')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateCategory)}
        className="space-y-8"
      >
        <Field.CategoryName />

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
