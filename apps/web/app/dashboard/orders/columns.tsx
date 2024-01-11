'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'

import { labels, priorities, statuses } from '@/config/table'
import { Task } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import {
  SelectLabelAction,
  SelectPriorityAction,
} from './data-table-row-actions'

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'details',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalhes do pedido" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <Link
            href={`/dashboard/orders/${row.original.id}`}
            className="max-w-[500px] truncate font-medium underline-offset-4 hover:underline"
          >
            {row.getValue('details')}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find((status) => {
        const value = row.getValue('status') as string
        return status.value.toLowerCase() === value.toLowerCase()
      })

      if (!status) {
        return null
      }

      const iconColor = {
        PENDING: 'text-blue-500',
        PREPARING: 'text-yellow-500',
        DELIVERED: 'text-green-500',
        CANCELED: 'text-red-500',
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon
              className={`mr-2 h-4 w-4 ${iconColor[status.value]}`}
            />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find((priority) => {
        const value = row.getValue('priority') as string
        return priority.value.toLowerCase() === value.toLowerCase()
      })

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      return value.map((v) => v.toUpperCase()).includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/orders/${row.original.id}`}
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon-xs',
            })}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <SelectPriorityAction row={row} />
          <SelectLabelAction row={row} />
        </div>
      )
    },
  },
]
