import Link from 'next/link'
import { Icons } from '../icons'
import { ModeToggle } from './mode-toggle'
import { SearchInput } from './search-input'
import { SignOutButton } from './sign-out-button'
import { ButtonLinkAdmin } from './buttons'
import { buttonVariants } from '../ui/button'

export function Header() {
  return (
    <header className="flex items-center justify-between gap-8 bg-gray-50 px-4 py-5 dark:bg-gray-900">
      <Link href="/dashboard" className="flex items-center gap-3">
        <Icons.logo className="h-7 w-7" />
        <h1 className="hidden text-xl font-bold md:block">Food Explorer</h1>
      </Link>

      <div className="hidden flex-1 sm:block">
        <SearchInput />
      </div>

      <div className="flex items-center gap-1">
        <Link
          href="/dashboard/favorite-dishes"
          className={buttonVariants({
            variant: 'link',
          })}
        >
          Pratos favoritos
        </Link>
        <ButtonLinkAdmin />
        <SignOutButton />
        <ModeToggle />
      </div>
    </header>
  )
}
