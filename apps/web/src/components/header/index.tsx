import Link from 'next/link'
import { Icons } from '../icons'
import { ModeToggle } from './mode-toggle'
import { SearchInput } from './search-input'
import { SignOutButton } from './sign-out-button'
import { FavoriteDish, NewDish, OrderButton } from './buttons'

export function Header() {
  return (
    <header className="bg-gray-50 px-3 py-4 dark:bg-gray-900">
      <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Icons.logo className="h-7 w-7" />
          <h1 className="hidden text-xl font-bold md:block">Food Explorer</h1>
        </Link>

        <div className="hidden flex-1 sm:block">
          <SearchInput />
        </div>

        <div className="flex items-center gap-1">
          <FavoriteDish />
          <NewDish />
          <OrderButton />
          <SignOutButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
