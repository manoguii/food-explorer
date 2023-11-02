'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { CreateDishFormValues, createDishFormSchema } from './schema'
import { AttachField } from './fields/attach-field'
import { NameField } from './fields/name-field'
import { CategoryField } from './fields/category-field'
import { IngredientsField } from './fields/ingredients-field'
import { PriceField } from './fields/price-field'
import { DescriptionField } from './fields/description-field'

const defaultValues: Partial<CreateDishFormValues> = {
  description: '',
  name: '',
  price: '',
  category: '',
  ingredients: [{ value: 'Batata' }, { value: 'Arroz' }, { value: 'Feijão' }],
}

export function CreateDishForm() {
  const form = useForm<CreateDishFormValues>({
    resolver: zodResolver(createDishFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: CreateDishFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <NameField />
          <AttachField />
          <CategoryField />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <IngredientsField />
          <PriceField />
        </div>

        <DescriptionField />

        <div className="flex items-end justify-end">
          <Button type="submit" className="">
            Criar prato
          </Button>
        </div>
      </form>
    </Form>
  )
}
