'use client'

import { Trigger } from '@radix-ui/react-select'
import { Row } from '@tanstack/react-table'
import { TrendingUp } from 'lucide-react'

import { statuses } from '@/config/table'
import { detailsSchema } from '@/lib/schemas'
import { OrderStatus } from '@/lib/types/definitions'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { updateDishStatus } from '@/app/actions'

interface SelectStatusActionProps<TData> {
  row: Row<TData>
}

export function SelectStatusAction<TData>({
  row,
}: SelectStatusActionProps<TData>) {
  const task = detailsSchema.parse(row.original)

  async function handleUpdateStatus(status: string) {
    const data = status as OrderStatus

    const result = await updateDishStatus(task.orderId, {
      status: data,
      dishId: task.id,
    })

    if (result.success) {
      toast({
        title: 'Status atualizado com sucesso !',
        description: result.message,
      })
    } else {
      toast({
        title: 'Erro ao atualizar status',
        description: result.message,
        variant: 'destructive',
      })
    }
  }
  return (
    <Select
      defaultValue={task.status}
      onValueChange={(value) => handleUpdateStatus(value)}
    >
      <Trigger asChild>
        <Button variant={'ghost'} size={'icon-xs'}>
          <TrendingUp className="h-4 w-4" />
        </Button>
      </Trigger>

      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {statuses.map((status) => (
            <SelectItem
              key={status.value}
              value={status.value}
              className="flex items-center gap-2"
            >
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
