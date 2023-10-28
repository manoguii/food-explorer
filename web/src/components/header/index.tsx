import { Icons } from '../icons'
import { Button } from '../ui/button'
import { ModeToggle } from './mode-toggle'
import { SearchInput } from './search-input'
import { SignOutButton } from './sign-out-button'

export function Header() {
  return (
    <header className="flex items-center justify-between gap-8 bg-gray-50 px-4 py-6 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Icons.logo className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Food Explorer</h1>
      </div>

      <div className="flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="destructive"
          className="flex items-center gap-2 px-8 py-3"
        >
          <Icons.receipt className="h-5 w-5" />
          Pedidos (0)
        </Button>

        <SignOutButton />

        <ModeToggle />
      </div>
    </header>
  )
}
