'use client'

import { LogOut } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import { logout } from '@/app/actions'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Icons } from '../icons'

export function OrderButton() {
  const { count } = useCartStore()

  return (
    <Link
      href="/orders/create"
      className={cn(
        buttonVariants({
          variant: 'destructive',
        }),
        'flex items-center gap-2',
      )}
    >
      <Icons.receipt className="h-5 w-5" />
      Pedidos ({count()})
    </Link>
  )
}

export function SignOutButton() {
  return (
    <Button variant="ghost" size="icon" onClick={async () => await logout()}>
      <LogOut className="h-5 w-5" />
    </Button>
  )
}
