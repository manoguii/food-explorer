'use client'

import React from 'react'
import { Row } from '@tanstack/react-table'
import { AlertTriangle, Trash } from 'lucide-react'

import { dishSchema } from '@/lib/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ButtonWithLoading } from '@/components/buttons/button-with-loading'
import { deleteDish } from '@/app/actions'

export function DeleteRowAction<TData>({ row }: { row: Row<TData> }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  const dish = dishSchema.parse(row.original)

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDeleteLoading(true)

    const result = await deleteDish(dish.id)

    if (result.success) {
      toast({
        title: 'Prato removido com sucesso !',
        description: result.message,
      })
    } else {
      toast({
        title: 'Erro ao remover o prato',
        description: result.message,
        variant: 'destructive',
      })
    }

    setIsDeleteLoading(false)
    setShowDeleteAlert(false)
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
          <AlertDialogTitle>
            Tem certeza de que deseja excluir o prato{' '}
            <Badge className="w-max">{dish.name}</Badge> ?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert className="!pl-6">
          <AlertTriangle />
          <AlertTitle>Atenção !</AlertTitle>
          <AlertDescription>
            Um prato so pode ser excluído se não estiver em nenhum pedido. Tem
            certeza de que deseja excluir o prato.
          </AlertDescription>
        </Alert>
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
