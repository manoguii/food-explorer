'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, MoreVertical } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteCategory, deleteDish } from '@/app/actions'

import { ButtonWithLoading } from './buttons/button-with-loading'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Badge } from './ui/badge'
import { buttonVariants } from './ui/button'
import { toast } from './ui/use-toast'

interface OperationsProps {
  item: {
    id: string
    name: string
    slug: string
  }
  entity: 'dish' | 'category'
}

export function Operations({ item, entity }: OperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDeleteLoading(true)

    if (entity === 'dish') {
      const result = await deleteDish(item.id)

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
    }

    if (entity === 'category') {
      const result = await deleteCategory(item.id)

      if (result.success) {
        toast({
          title: 'Categoria removida com sucesso !',
          description: result.message,
        })
      } else {
        toast({
          title: 'Erro ao remover a categoria',
          description: result.message,
          variant: 'destructive',
        })
      }
    }

    setIsDeleteLoading(false)
    setShowDeleteAlert(false)
    router.refresh()
  }

  const message =
    entity === 'dish'
      ? `Tem certeza de que deseja excluir o prato `
      : `Tem certeza de que deseja excluir a categoria `

  const alertMessage = {
    dish: {
      title: 'Atenção !',
      description:
        'Um prato so pode ser excluído se não estiver em nenhum pedido. Tem certeza de que deseja excluir o prato.',
    },
    category: {
      title: 'Atenção !',
      description:
        'Para excluir uma categoria, ela não pode esta associada a nenhum prato.',
    },
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2">
          <DropdownMenuItem className="px-3 py-2">
            <Link
              href={
                entity === 'dish'
                  ? `/dashboard/dishes/${item.slug}/edit`
                  : `/dashboard/categories/${item.slug}/edit`
              }
              className="flex w-full"
            >
              Editar
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center px-3 py-2 text-red-500 focus:text-red-500"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {message} <Badge className="w-max">{item.name}</Badge> ?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Alert className="!pl-6">
            <AlertTriangle />
            <AlertTitle>{alertMessage[entity].title}</AlertTitle>
            <AlertDescription>
              {alertMessage[entity].description}
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
    </>
  )
}
