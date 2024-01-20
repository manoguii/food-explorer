'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { CartItem } from '@/lib/types/definitions'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

const IMAGE_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_BASE_URL

export const columns: ColumnDef<CartItem>[] = [
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
            src={`${IMAGE_URL}/${attachments[0].url}`}
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
]
