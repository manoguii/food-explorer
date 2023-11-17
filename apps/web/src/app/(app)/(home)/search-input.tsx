'use client'

import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }

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
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
    </form>
  )
}
