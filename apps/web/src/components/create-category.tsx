'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { NewCategoryFormSchema, newCategoryFormSchema } from '@/lib/schemas'
import { createCategory } from '@/app/actions'
import { toast } from './ui/use-toast'

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="mr-2 h-4 w-4" />
          Criar categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="outline-none sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar nova categoria</DialogTitle>
          <div className="space-y-3">
            <DialogDescription>
              Lembre que um prato obrigatoriamente precisa estar associado a uma{' '}
              <span className="font-semibold text-accent-foreground">
                categoria
              </span>
              .
            </DialogDescription>
            <DialogDescription className="flex items-center text-start">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              <span>
                Exemplos de{' '}
                <span className="font-semibold text-accent-foreground">
                  categorias:
                </span>{' '}
              </span>
            </DialogDescription>
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
        </DialogHeader>

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
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogTrigger>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
