'use client'

import { Trash } from 'lucide-react'
import * as React from 'react'

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
import { deleteCategory } from '@/db/mutations/delete-category'
import { Category } from '@/lib/types/definitions'

import { ButtonWithLoading } from '../button-with-loading'
import { buttonVariants } from '../ui/button'
import { toast } from '../ui/use-toast'

export function DeleteCategory({ category }: { category: Category }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDeleteLoading(true)

    try {
      await deleteCategory(category.id)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro ao excluir categoria',
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
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>

          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria{' '}
            <span className="font-semibold text-primary">
              &quot;{category.name}
            </span>
            &quot; ? <br /> Para excluir uma categoria, ela não pode esta
            associada a nenhum prato.
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
