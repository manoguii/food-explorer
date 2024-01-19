'use client'

import * as React from 'react'
// import { updateOrder } from '@/db/mutations'
import { Trigger } from '@radix-ui/react-select'
import { Row } from '@tanstack/react-table'
import { ArrowLeftRight, Tag } from 'lucide-react'

import { labels, priorities } from '@/config/table'
import { orderSchema } from '@/lib/schemas'
import { Label, Priority } from '@/lib/types/definitions'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

interface SelectPriorityActionProps<TData> {
  row: Row<TData>
}

interface SelectLabelActionProps<TData> {
  row: Row<TData>
}

export function SelectPriorityAction<TData>({
  row,
}: SelectPriorityActionProps<TData>) {
  const task = orderSchema.parse(row.original)

  async function handleUpdatePriority(priority: string) {
    const data = priority.toLocaleUpperCase() as Priority
    console.log(data)
    try {
      // await updateOrder(task.id, {
      //   priority: data,
      // })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro ao atualizar prioridade',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Select
      defaultValue={task.priority.toLowerCase()}
      onValueChange={(value) => handleUpdatePriority(value)}
    >
      <Trigger asChild>
        <Button variant={'ghost'} size={'icon-xs'}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </Trigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Prioridade</SelectLabel>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectLabelAction<TData>({
  row,
}: SelectLabelActionProps<TData>) {
  const task = orderSchema.parse(row.original)

  async function handleUpdateLabel(label: string) {
    const data = label.toLocaleUpperCase() as Label

    console.log(data)
    try {
      // await updateOrder(task.id, {
      //   label: data,
      // })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro ao atualizar label',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Select
      defaultValue={task.label}
      onValueChange={(value) => handleUpdateLabel(value)}
    >
      <Trigger asChild>
        <Button variant={'ghost'} size={'icon-xs'}>
          <Tag className="h-4 w-4" />
        </Button>
      </Trigger>

      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Label</SelectLabel>
          {labels.map((label) => (
            <SelectItem key={label.value} value={label.value}>
              {label.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
