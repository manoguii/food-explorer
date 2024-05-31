import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function CreateButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('gap-1', buttonVariants())}>
        Criar novo
        <ChevronDown className="ml-1" size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="grid p-2">
        <DropdownMenuItem asChild className="cursor-pointer px-3 py-2">
          <Link href={`/dashboard/dishes/create`}>Prato</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer px-3 py-2">
          <Link href={`/dashboard/categories`}>Categoria</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
