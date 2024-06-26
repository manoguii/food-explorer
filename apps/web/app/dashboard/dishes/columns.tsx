'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import Price from '@/components/food/price'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { DishWithDetails } from '@/lib/types/definitions'

import { DeleteRowAction } from './data-table-row-actions'

export const columns: ColumnDef<DishWithDetails>[] = [
  {
    accessorKey: 'attachments',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arquivos" />
    ),
    cell: ({ row }) => {
      const attachments = row.original.attachments

      return (
        <div className="flex -space-x-4 rtl:space-x-reverse">
          {attachments.map((attachment) => (
            <Image
              key={attachment.id}
              src={attachment.url}
              alt={attachment.title}
              className="rounded-full border-2 border-white dark:border-gray-800"
              width={40}
              height={40}
            />
          ))}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Detalhes do prato" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-80 flex-col">
          <span className="font-medium">{row.getValue('name')}</span>
          <span className="truncate text-muted-foreground">
            {row.original.description}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço" />
    ),
    cell: ({ row }) => {
      const price = row.original.price

      return (
        <div className="flex items-center">
          <Price
            amount={price.toString()}
            currencyCode="BRL"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    cell: ({ row }) => {
      const category = row.original.category

      return (
        <div className="flex items-center">
          <Badge>{category}</Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'ingredients',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ingredientes" />
    ),
    cell: ({ row }) => {
      const ingredients = row.original.ingredients

      return (
        <div className="flex items-center gap-1">
          {ingredients.slice(0, 3).map((ingredient) => (
            <Badge key={ingredient} variant="outline">
              <span className="max-w-[120px] truncate">{ingredient}</span>
            </Badge>
          ))}
          {ingredients.length > 3 && (
            <Badge variant="outline">
              <span className="max-w-[120px] truncate">
                +{ingredients.length - 3}
              </span>
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/dishes/${row.original.slug}/edit`}
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon-xs',
            })}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <DeleteRowAction row={row} />
        </div>
      )
    },
  },
]
