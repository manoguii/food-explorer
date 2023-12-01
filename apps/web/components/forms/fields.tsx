import React from 'react'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { AlertCircle, Check, Loader2, X } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { CreateDishFormValues, UpdateDishFormValues } from '@/lib/schemas'
import { Category as CategoryType } from '@/lib/types/definitions'
import { Dialog } from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import * as Select from '@/components/ui/select'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { CreateIngredients } from './dialog/create-ingredients'

export function Name({
  placeholder = 'John doe',
  description,
}: {
  placeholder?: string
  description?: string
}) {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <Form.FormItem className="flex basis-3/6 flex-col gap-1">
          <Form.FormLabel>Nome</Form.FormLabel>
          <Form.FormControl>
            <Input placeholder={placeholder} {...field} />
          </Form.FormControl>
          {description && (
            <Form.FormDescription>{description}</Form.FormDescription>
          )}

          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  )
}

export function Email() {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <Form.FormItem>
          <Form.FormLabel>Email</Form.FormLabel>
          <Form.FormControl>
            <Input placeholder="johndoe@example.com" type="email" {...field} />
          </Form.FormControl>

          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  )
}

export function Password() {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <Form.FormItem>
          <Form.FormLabel>Senha</Form.FormLabel>
          <Form.FormControl>
            <Input
              placeholder="No mínimo 6 caracteres"
              type="password"
              {...field}
            />
          </Form.FormControl>

          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  )
}

export function Description() {
  const form = useFormContext()

  return (
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
  )
}

export function Price() {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <Form.FormItem className="flex basis-2/6 flex-col gap-1">
          <Form.FormLabel>Preço</Form.FormLabel>
          <Form.FormControl>
            <Input placeholder="R$ 12,00" {...field} />
          </Form.FormControl>
          <Form.FormDescription>Digite o preço do prato.</Form.FormDescription>
          <Form.FormMessage />
        </Form.FormItem>
      )}
    />
  )
}

export function Category({
  categories,
  currentCategory,
}: {
  categories: CategoryType[]
  currentCategory?: string
}) {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <Form.FormItem className="flex basis-2/6 flex-col gap-1">
          <Form.FormLabel>Categoria</Form.FormLabel>
          <Select.Select
            defaultValue={currentCategory}
            onValueChange={field.onChange}
          >
            <Form.FormControl>
              <Select.SelectTrigger className="w-full">
                <Select.SelectValue
                  defaultValue={currentCategory}
                  placeholder="Selecione a categoria"
                />
              </Select.SelectTrigger>
            </Form.FormControl>
            <Select.SelectContent>
              <Select.SelectGroup>
                <Select.SelectLabel>Categorias</Select.SelectLabel>
                {categories?.map((category) => (
                  <Select.SelectItem key={category.id} value={category.name}>
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
  )
}

export function File({
  state,
}: {
  state: 'idle' | 'uploading' | 'success' | 'error'
}) {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="file"
      render={({ field: { onChange } }) => {
        return (
          <Form.FormItem className="flex basis-2/6 flex-col gap-1">
            <Form.FormLabel className="flex items-center">
              Arquivo
              {state === 'uploading' && (
                <Loader2 className="ml-2 h-3 w-3 animate-spin" />
              )}
              {state === 'success' && (
                <Check className="ml-2 h-3 w-3 text-green-600" />
              )}
              {state === 'error' && (
                <AlertCircle className="ml-2 h-3 w-3 text-red-400" />
              )}
            </Form.FormLabel>
            <Form.FormControl>
              <Input
                type="file"
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    onChange(event.target.files[0])
                  }
                }}
              />
            </Form.FormControl>
            {state === 'idle' && (
              <Form.FormDescription>Selecione um arquivo</Form.FormDescription>
            )}
            {state === 'uploading' && (
              <Form.FormDescription>
                Fazendo upload das imagens ...
              </Form.FormDescription>
            )}
            {state === 'success' && (
              <Form.FormDescription>
                Imagens enviadas com sucesso !
              </Form.FormDescription>
            )}
            {state === 'error' && (
              <Form.FormDescription className="text-red-400">
                Ocorreu um erro ao fazer upload das imagens
              </Form.FormDescription>
            )}
            <Form.FormMessage />
          </Form.FormItem>
        )
      }}
    />
  )
}

export function Ingredients({ type }: { type: 'create' | 'update' }) {
  const [ingredientsDialogOpen, setIngredientsDialogOpen] =
    React.useState(false)

  const form = useFormContext<UpdateDishFormValues | CreateDishFormValues>()

  const { remove } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  return (
    <Form.FormField
      control={form.control}
      name={`ingredients`}
      render={({ field }) => {
        return (
          <Dialog
            open={ingredientsDialogOpen}
            onOpenChange={setIngredientsDialogOpen}
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
                      setIngredientsDialogOpen(true)
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

            <CreateIngredients
              type={type}
              fields={field.value}
              onRequestClose={() => {
                setIngredientsDialogOpen(false)
              }}
            />
          </Dialog>
        )
      }}
    />
  )
}
