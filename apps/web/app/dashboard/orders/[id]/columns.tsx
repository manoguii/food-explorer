'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { statuses } from '@/config/table'
import { Details } from '@/lib/schemas'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Details>[] = [
  {
    accessorKey: 'attachments',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Imagem" />
    ),
    cell: ({ row }) => {
      const attachments = row.getValue('attachments') as {
        id: string
        url: string
        title: string
      }[]

      return (
        <div>
          <Image
            alt={attachments[0].title}
            src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${attachments[0].url}`}
            width={50}
            height={50}
            className="aspect-square rounded-md"
          />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do prato" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[500px]">
          <span className="max-w-md truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {row.getValue('quantity') === 1
              ? '1 unidade'
              : `${row.getValue('quantity')} unidades`}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
