import { Search } from 'lucide-react'
import { Input } from '../ui/input'

export function SearchInput() {
  return (
    <form className="flex items-center">
      <label className="sr-only">Search</label>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5" />
        </div>

        <Input
          placeholder="Busque por pratos ou ingredientes"
          className="bg-gray-100 pl-10 dark:bg-gray-800"
        />
      </div>
    </form>
  )
}
