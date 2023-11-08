'use client'

import * as React from 'react'
import * as Form from '@/components/ui/form'
import * as Select from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CreateDishFormValues, createDishFormSchema } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { IngredientsDialog } from '../ingredients-dialog'
import { X, Bug, Check, Loader2 } from 'lucide-react'
import { Category } from '@/lib/types/definitions'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { createDish, uploadFile } from '@/app/actions'

const defaultValues: Partial<CreateDishFormValues> = {
  description: '',
  name: '',
  price: '',
  category: '',
  ingredients: [{ value: 'Batata' }, { value: 'Arroz' }, { value: 'Feijão' }],
}

export function CreateDishForm({ categories }: { categories: Category[] }) {
  const [createIngredientDialogOpen, setCreateIngredientDialogOpen] =
    React.useState(false)
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

  const { remove } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  return (
    <Form.Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDish)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Name field */}
          <Form.FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.FormItem className="flex basis-3/6 flex-col gap-1">
                <Form.FormLabel>Nome</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="Salada Ceasar" {...field} />
                </Form.FormControl>
                <Form.FormDescription>
                  Digite o nome do prato.
                </Form.FormDescription>

                <Form.FormMessage />
              </Form.FormItem>
            )}
          />

          {/* Attachment field */}
          <Form.FormField
            control={form.control}
            name="file"
            render={({ field: { onChange } }) => {
              return (
                <Form.FormItem className="flex basis-2/6 flex-col gap-1">
                  <Form.FormLabel className="flex items-center">
                    Arquivo
                    {uploadingFile.state === 'uploading' && (
                      <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                    )}
                    {uploadingFile.state === 'success' && (
                      <Check className="ml-2 h-3 w-3 text-green-600" />
                    )}
                    {uploadingFile.state === 'error' && (
                      <Bug className="ml-2 h-3 w-3 text-red-400" />
                    )}
                  </Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      type="file"
                      onChange={(event) => {
                        if (
                          event.target.files &&
                          event.target.files.length > 0
                        ) {
                          onChange(event.target.files[0])
                        }
                      }}
                    />
                  </Form.FormControl>
                  {uploadingFile.state === 'idle' && (
                    <Form.FormDescription>
                      Selecione um arquivo
                    </Form.FormDescription>
                  )}
                  {uploadingFile.state === 'uploading' && (
                    <Form.FormDescription>
                      Fazendo upload das imagens ...
                    </Form.FormDescription>
                  )}
                  {uploadingFile.state === 'success' && (
                    <Form.FormDescription>
                      Imagens enviadas com sucesso !
                    </Form.FormDescription>
                  )}
                  {uploadingFile.state === 'error' && (
                    <Form.FormDescription className="text-red-400">
                      Ocorreu um erro ao fazer upload das imagens
                    </Form.FormDescription>
                  )}
                  <Form.FormMessage />
                </Form.FormItem>
              )
            }}
          />

          {/* Category field */}
          <Form.FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <Form.FormItem className="flex basis-2/6 flex-col gap-1">
                <Form.FormLabel>Categoria</Form.FormLabel>
                <Select.Select onValueChange={field.onChange}>
                  <Form.FormControl>
                    <Select.SelectTrigger className="w-full">
                      <Select.SelectValue placeholder="Selecione a categoria" />
                    </Select.SelectTrigger>
                  </Form.FormControl>
                  <Select.SelectContent>
                    <Select.SelectGroup>
                      <Select.SelectLabel>Categorias</Select.SelectLabel>
                      {categories?.map((category) => (
                        <Select.SelectItem
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
                        </Select.SelectItem>
                      ))}
                    </Select.SelectGroup>
                  </Select.SelectContent>
                </Select.Select>
                <Form.FormDescription>
                  Selecione a categoria do prato.
                </Form.FormDescription>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Ingredients field */}
          <Form.FormField
            control={form.control}
            name={`ingredients`}
            render={({ field }) => {
              return (
                <Dialog
                  open={createIngredientDialogOpen}
                  onOpenChange={setCreateIngredientDialogOpen}
                >
                  <Form.FormItem className="flex basis-4/6 flex-col gap-1">
                    <Form.FormLabel>Ingredientes</Form.FormLabel>
                    <Form.FormControl>
                      <div className="flex flex-col items-start gap-4 md:flex-row">
                        <Button
                          variant="outline"
                          type="button"
                          className="w-max"
                          onClick={() => {
                            setCreateIngredientDialogOpen(true)
                          }}
                        >
                          <PlusCircledIcon className="h-4 w-4" />
                          <span className="ml-2">Adicionar ingrediente</span>
                        </Button>

                        <div className="flex min-h-[40px] w-full flex-wrap items-center justify-start gap-2 rounded-md border border-dashed px-4 py-2">
                          {field.value.map((item, index) => {
                            return (
                              <Badge
                                key={item.value}
                                variant="outline"
                                className="gap-1"
                              >
                                {item.value}
                                <Button
                                  type="button"
                                  className="h-3 w-3 p-0"
                                  onClick={() => {
                                    remove(index)
                                  }}
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </Form.FormControl>
                    <Form.FormDescription>
                      Selecione os ingredientes do prato.
                    </Form.FormDescription>
                    <Form.FormMessage />
                  </Form.FormItem>

                  <IngredientsDialog
                    type="create"
                    fields={field.value}
                    onRequestClose={() => {
                      setCreateIngredientDialogOpen(false)
                    }}
                  />
                </Dialog>
              )
            }}
          />

          {/* Price field */}
          <Form.FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <Form.FormItem className="flex basis-2/6 flex-col gap-1">
                <Form.FormLabel>Preço</Form.FormLabel>
                <Form.FormControl>
                  <Input placeholder="R$ 12,00" {...field} />
                </Form.FormControl>
                <Form.FormDescription>
                  Digite o preço do prato.
                </Form.FormDescription>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
        </div>

        {/* Description field */}
        <Form.FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.FormItem>
              <Form.FormLabel>Descrição</Form.FormLabel>
              <Form.FormControl>
                <Textarea
                  placeholder="Adicione uma descrição para o seu prato."
                  className="resize-none"
                  {...field}
                />
              </Form.FormControl>
              <Form.FormDescription>
                Crie uma descrição para o seu prato.
              </Form.FormDescription>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />

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
