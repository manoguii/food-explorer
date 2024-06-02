'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { labels, priorities, statuses } from '@/config/table'
import { OrderWithDetails } from '@/lib/types/definitions'
import { getDetails } from '@/lib/utils'

import {
  SelectLabelAction,
  SelectPriorityAction,
} from './data-table-row-actions'

export const columns: ColumnDef<OrderWithDetails>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }) => {
      const code = row.original.code.slice(0, 8)

      return <div className="w-[80px]">#{code}</div>
    },
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

      const details = getDetails(row.original.cart.cartItems)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <Link
            href={`/dashboard/orders/${row.original.orderId}`}
            className="max-w-[500px] truncate font-medium underline-offset-4 hover:underline"
          >
            {details}
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
          <SelectPriorityAction row={row} />
          <SelectLabelAction row={row} />
        </div>
      )
    },
  },
]
