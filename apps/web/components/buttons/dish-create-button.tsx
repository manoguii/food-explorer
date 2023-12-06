import * as React from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

type DishCreateButtonProps = ButtonProps

export function DishCreateButton({
  className,
  variant,
}: DishCreateButtonProps) {
  return (
    <Link
      href="/dashboard/dish/create"
      className={cn(buttonVariants({ variant }), className)}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Criar prato
    </Link>
  )
}
