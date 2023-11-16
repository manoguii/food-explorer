import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'

export function SearchInput() {
  return (
    <form className="flex items-center">
      <label className="sr-only">Search</label>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4" />
        </div>

        <Input
          placeholder="Busque por pratos ou ingredientes"
          className="pl-10"
        />
      </div>
    </form>
  )
}
