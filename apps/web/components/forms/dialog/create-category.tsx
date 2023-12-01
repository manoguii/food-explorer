'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { NewCategoryFormSchema, newCategoryFormSchema } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategory } from '@/app/actions'

import { toast } from '../../ui/use-toast'

export function CreateCategory() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<NewCategoryFormSchema>({
    resolver: zodResolver(newCategoryFormSchema),
    defaultValues: {
      category: '',
    },
  })

  async function handleCreateCategory({ category }: NewCategoryFormSchema) {
    const data = await createCategory(category)

    if (data.success) {
      toast({
        title: 'Categoria criada com sucesso !',
        description: data.message,
      })
    } else {
      toast({
        title: 'Erro ao criar categoria',
        description: data.message,
        variant: 'destructive',
      })
    }

    reset()
  }

  return (
    <D.Dialog>
      <D.DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="mr-2 h-4 w-4" />
          Criar categoria
        </Button>
      </D.DialogTrigger>
      <D.DialogContent className="outline-none sm:max-w-[600px]">
        <D.DialogHeader>
          <D.DialogTitle>Criar nova categoria</D.DialogTitle>
          <div className="space-y-3">
            <D.DialogDescription>
              Lembre que um prato obrigatoriamente precisa estar associado a uma{' '}
              <span className="font-semibold text-accent-foreground">
                categoria
              </span>
              .
            </D.DialogDescription>
            <D.DialogDescription className="flex items-center text-start">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              <span>
                Exemplos de{' '}
                <span className="font-semibold text-accent-foreground">
                  categorias:
                </span>{' '}
              </span>
            </D.DialogDescription>
            <ol className="space-y-2">
              <li className="text-start text-sm text-muted-foreground">
                <Badge variant="outline">Bebidas</Badge> - refrigerantes, cafés,
                vinhos, etc.
              </li>
              <li className="text-start text-sm text-muted-foreground">
                <Badge variant="outline">Sobremesas</Badge> - petit gateau,
                pudim, etc.
              </li>
              <li className="text-start text-sm text-muted-foreground">
                <Badge variant="outline">Massas</Badge> - lasanha, macarronada,
                etc.
              </li>
            </ol>
          </div>
        </D.DialogHeader>

        <form onSubmit={handleSubmit(handleCreateCategory)} className="w-full">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-baseline gap-4">
              <Label
                htmlFor="category"
                className="col-span-3 sm:col-span-1 sm:text-right"
              >
                Nova categoria
              </Label>
              <div className="col-span-4 space-y-4 sm:col-span-3">
                <Input
                  id="category"
                  placeholder="Sua nova categoria"
                  disabled={isSubmitting}
                  {...register('category')}
                />
                {errors.category && (
                  <p className="text-sm font-medium text-red-500 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <D.DialogFooter>
            <D.DialogTrigger asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </D.DialogTrigger>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Criar'
              )}
            </Button>
          </D.DialogFooter>
        </form>
      </D.DialogContent>
    </D.Dialog>
  )
}
