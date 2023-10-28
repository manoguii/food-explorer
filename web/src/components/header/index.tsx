import Link from 'next/link'
import { Icons } from '../icons'
import { buttonVariants } from '../ui/button'
import { ModeToggle } from './mode-toggle'
import { SearchInput } from './search-input'
import { SignOutButton } from './sign-out-button'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="flex items-center justify-between gap-8 bg-gray-50 px-4 py-6 dark:bg-gray-900">
      <Link href="/" className="flex items-center gap-3">
        <Icons.logo className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Food Explorer</h1>
      </Link>

      <div className="flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dish/new"
          className={cn(
            buttonVariants({
              variant: 'destructive',
            }),
            'flex items-center gap-2 px-8 py-3',
          )}
        >
          <Icons.receipt className="h-5 w-5" />
          Pedidos (0)
        </Link>

        <SignOutButton />

        <ModeToggle />
      </div>
    </header>
  )
}
