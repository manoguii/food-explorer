'use client'

import React from 'react'
import { deleteDish } from '@/db/mutations'
import { Row } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ButtonWithLoading } from '@/components/button-with-loading'

const dishSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string(),
  attachments: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
    }),
  ),
  category: z.string(),
  ingredients: z.array(z.string()),
})

export function DeleteRowAction<TData>({ row }: { row: Row<TData> }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  const dish = dishSchema.parse(row.original)

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDeleteLoading(true)

    try {
      await deleteDish(dish.id)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro ao remover o prato',
          description: error.message,
          variant: 'destructive',
        })
      }
    } finally {
      setIsDeleteLoading(false)
      setShowDeleteAlert(false)
    }
  }

  return (
    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogTrigger
        className={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
      >
        <Trash className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            Excluir prato
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o prato{' '}
            <span className="font-semibold text-primary">
              &quot;{dish.name}&quot;
            </span>{' '}
            ?
            <br />
            Um prato so pode ser excluído se não estiver em nenhum pedido.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            asChild
          >
            <ButtonWithLoading
              icon="trash"
              isLoading={isDeleteLoading}
              onClick={handleDelete}
            >
              Excluir
            </ButtonWithLoading>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
