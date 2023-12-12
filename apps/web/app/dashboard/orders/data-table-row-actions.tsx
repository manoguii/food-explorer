'use client'

import Link from 'next/link'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { labels, priorities } from '@/config/table'
import { taskSchema } from '@/lib/schemas'
import { Label, Priority } from '@/lib/types/definitions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { updateOrder } from '@/app/actions'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  async function handleUpdatePriority(priority: string) {
    const data = priority.toLocaleUpperCase() as Priority

    const result = await updateOrder(task.id, {
      priority: data,
    })

    if (result.success) {
      toast({
        title: 'Pedido atualizado com sucesso !',
        description: result.message,
      })
    } else {
      toast({
        title: 'Erro ao atualizar o pedido !',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  async function handleUpdateLabel(label: string) {
    const data = label.toLocaleUpperCase() as Label

    const result = await updateOrder(task.id, {
      label: data,
    })

    if (result.success) {
      toast({
        title: 'Pedido atualizado com sucesso !',
        description: result.message,
      })
    } else {
      toast({
        title: 'Erro ao atualizar o pedido !',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={`/dashboard/orders/${task.id}`}>Detalhes</Link>
        </DropdownMenuItem>

        <DropdownMenuLabel>Atualizar</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Prioridade</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={task.priority.toLocaleLowerCase()}
              onValueChange={(value) => handleUpdatePriority(value)}
            >
              {priorities.map((priority) => (
                <DropdownMenuRadioItem
                  key={priority.value}
                  value={priority.value}
                >
                  {priority.label}
                  <priority.icon className="ml-auto h-4 w-4" />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Label</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={task.label}
              onValueChange={(value) => handleUpdateLabel(value)}
            >
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
