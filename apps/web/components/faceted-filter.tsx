'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface FacetedFilterProps {
  title: string
  options: {
    id: string
    name: string
  }[]
}

export function FacetedFilter({ title, options }: FacetedFilterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const params = new URLSearchParams(searchParams)
  const selectedValues = new Set(
    searchParams.getAll('category').map((c) => c.toLowerCase()),
  )

  const categories = options.map((option) => ({
    id: option.id,
    name: option.name.toLowerCase(),
  }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex space-x-1">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedValues.has(option.name.toLowerCase()),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Nenhum resultado</CommandEmpty>
            <CommandGroup>
              {categories.map((option) => {
                const isSelected = selectedValues.has(option.name)

                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        params.delete('category')
                        params.delete('page')
                        selectedValues.delete(option.name)
                        replace(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        })
                      } else {
                        params.delete('query')
                        params.delete('page')
                        selectedValues.add(option.name)
                        const filterValues = Array.from(selectedValues)
                        filterValues.forEach((value) => {
                          params.set('category', value)
                          // params.append('category', value)
                        })

                        replace(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        })
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>

                    <span>{option.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      selectedValues.clear()
                      params.delete('category')
                      params.delete('page')
                      replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      })
                    }}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
