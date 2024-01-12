'use client'

import { useState } from 'react'
import { createCategory } from '@/db/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { NewCategoryFormSchema, newCategoryFormSchema } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ButtonWithLoading } from '@/components/buttons/button-with-loading'

import { toast } from '../../ui/use-toast'

export function CreateCategory() {
  const [dialogOpen, setDialogOpen] = useState(false)
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
    try {
      await createCategory(category)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error !',
          description: error.message,
          variant: 'destructive',
        })
      }
    } finally {
      setDialogOpen(false)
      reset()
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
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
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogTrigger asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogTrigger>
            <ButtonWithLoading type="submit" isLoading={isSubmitting}>
              Criar categoria
            </ButtonWithLoading>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
