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
import { CreateDishFormValues } from '../schema'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { categories } from '@/tmp/data'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { CreateNewCategoryDialog } from '../dialog/create-category-dialog'
import { cn } from '@/lib/utils'

export function CategoryField() {
  const [createTagDialogOpen, setCreateTagDialogOpen] = React.useState(false)
  const form = useFormContext<CreateDishFormValues>()

  return (
    <Dialog open={createTagDialogOpen} onOpenChange={setCreateTagDialogOpen}>
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
                      ? categories.find(
                          (category) => category.category === field.value,
                        )?.category
                      : 'Selecione a categoria'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandEmpty>Nenhuma categoria encontrada</CommandEmpty>

                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setCreateTagDialogOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Criar categoria
                    </CommandItem>
                  </CommandGroup>

                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        value={category.category}
                        key={category.id}
                        onSelect={() => {
                          form.setValue('category', category.category)
                          form.trigger('category')
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            category.category === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {category.category}
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

      <CreateNewCategoryDialog
        onRequestClose={() => {
          setCreateTagDialogOpen(false)
        }}
      />
    </Dialog>
  )
}
