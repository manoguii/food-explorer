import React from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '../../../lib/schema'
import { Button } from '@/components/ui/button'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categories } from '@/tmp/data'

export function CategoryField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex basis-2/6 flex-col gap-1">
          <FormLabel>Categoria</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value
                    ? categories?.find(
                        (category) => category.name === field.value,
                      )?.name
                    : 'Selecione a categoria'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandEmpty>Nenhuma categoria encontrada</CommandEmpty>

                <CommandGroup>
                  {categories?.map((category) => (
                    <CommandItem
                      value={category.name}
                      key={category.id}
                      onSelect={() => {
                        form.setValue('category', category.name)
                        form.trigger('category')
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          category.name === field.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>Selecione a categoria do prato.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
