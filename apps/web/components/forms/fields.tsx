import { AlertCircle, Check, Loader2, Upload, X } from 'lucide-react'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import * as Form from '@/components/ui/form'
import * as Select from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DishFormValues } from '@/lib/schemas'
import { Category as CategoryType } from '@/lib/types/definitions'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface NameProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  description?: string
}

export function Name({
  placeholder = 'John doe',
  description,
  className,
  ...rest
}: NameProps) {
  const form = useFormContext()

  return (
    <Form.FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <Form.FormItem
          className={cn('flex flex-col gap-1', className)}
          {...rest}
        >
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
        <Form.FormItem>
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
        <Form.FormItem>
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
          <Form.FormItem className="rounded-md border border-dashed p-4">
            <Form.FormLabel className="flex items-center gap-2">
              Arquivo
              {state === 'idle' && <Upload className="ml-2 h-3 w-3" />}
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

export function Ingredients() {
  const form = useFormContext<DishFormValues>()

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
          <Form.FormItem>
            <Form.FormControl>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {field.value.map((item, index) => {
                    return (
                      <TableRow key={item.value}>
                        <TableCell className="font-semibold">
                          {item.value}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              remove(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Form.FormControl>
            <Form.FormDescription>
              Selecione os ingredientes do prato.
            </Form.FormDescription>
            <Form.FormMessage />
          </Form.FormItem>
        )
      }}
    />
  )
}
