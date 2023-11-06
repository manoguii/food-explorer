import Link from 'next/link'
import { Icons } from '../icons'
import { ModeToggle } from './mode-toggle'
import { SearchInput } from './search-input'
import { SignOutButton } from './sign-out-button'
import { ButtonLinkAdmin } from './buttons'

export function Header() {
  return (
    <header className="flex items-center justify-between gap-8 bg-gray-50 px-4 py-5 dark:bg-gray-900">
      <Link href="/" className="flex items-center gap-3">
        <Icons.logo className="h-7 w-7" />
        <h1 className="text-xl font-bold">Food Explorer</h1>
      </Link>

      <div className="flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center gap-3">
        <ButtonLinkAdmin />
        <SignOutButton />
        <ModeToggle />
      </div>
    </header>
  )
}
