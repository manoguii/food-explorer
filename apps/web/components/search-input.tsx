'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { searchDishFormSchema, SearchDishFormValues } from '@/lib/schemas'
import { cn, createUrl } from '@/lib/utils'

import { Input } from './ui/input'

const defaultValues: Partial<SearchDishFormValues> = {
  search: '',
}

interface SearchInputProps extends React.HTMLAttributes<HTMLFormElement> {
  onClose?: (open: boolean) => void
}

export function SearchInput({ onClose, className, ...rest }: SearchInputProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { register, handleSubmit, reset } = useForm<SearchDishFormValues>({
    resolver: zodResolver(searchDishFormSchema),
    defaultValues,
  })

  function handleSearch(data: SearchDishFormValues) {
    const search = data.search
    const newParams = new URLSearchParams(searchParams.toString())

    newParams.delete('page')

    if (search) {
      newParams.set('query', search)
    } else {
      newParams.delete('query')
    }

    router.push(createUrl('/food/search', newParams))

    reset()

    if (onClose) {
      onClose(false)
    }
  }

  return (
    <form
      className={cn('flex flex-1 items-center', className)}
      onSubmit={handleSubmit(handleSearch)}
      {...rest}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4" />
        </div>

        <Input
          placeholder="Busque por pratos"
          className="pl-10"
          {...register('search')}
        />
      </div>
    </form>
  )
}
