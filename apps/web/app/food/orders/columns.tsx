'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { labels, statuses } from '@/config/table'
import { OrderWithDetails } from '@/lib/types/definitions'
import { getDetails } from '@/lib/utils'

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
          <span className="max-w-[500px] truncate font-medium">{details}</span>
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
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      )

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
]
