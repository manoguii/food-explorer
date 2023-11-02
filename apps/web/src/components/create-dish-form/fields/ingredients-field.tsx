import React from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '../../../lib/schema'
import { Button } from '@/components/ui/button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { CreateNewIngredientDialog } from '../create-ingredients-dialog'
import { X } from 'lucide-react'

export function IngredientsField() {
  const [createIngredientDialogOpen, setCreateIngredientDialogOpen] =
    React.useState(false)
  const form = useFormContext<CreateDishFormValues>()

  const { remove } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  return (
    <FormField
      control={form.control}
      name={`ingredients`}
      render={({ field }) => {
        const isLong = field.value.length > 5
        const initial = field.value.slice(0, 5)
        const itemsRest = field.value.slice(5)

        return (
          <Dialog
            open={createIngredientDialogOpen}
            onOpenChange={setCreateIngredientDialogOpen}
          >
            <FormItem className="flex basis-4/6 flex-col gap-1">
              <FormLabel>Ingredientes</FormLabel>
              <FormControl>
                <div className="flex flex-col items-start gap-4 md:flex-row">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-max"
                    onClick={() => {
                      setCreateIngredientDialogOpen(true)
                    }}
                  >
                    <PlusCircledIcon className="h-4 w-4" />
                    <span className="ml-2">Adicionar ingrediente</span>
                  </Button>

                  <div className="flex w-full flex-wrap items-center justify-start gap-2 rounded-md border border-dashed px-4 py-2">
                    {!isLong
                      ? field.value.map((item, index) => {
                          return (
                            <Badge
                              key={item.value}
                              variant="outline"
                              className="gap-1"
                            >
                              {item.value}
                              <Button
                                type="button"
                                className="h-3 w-3 p-0"
                                onClick={() => {
                                  remove(index)
                                }}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          )
                        })
                      : initial.map((item, index) => {
                          return (
                            <Badge
                              key={item.value}
                              variant="outline"
                              className="gap-1"
                            >
                              {item.value}
                              <Button
                                type="button"
                                className="h-3 w-3 p-0"
                                onClick={() => {
                                  remove(index)
                                }}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          )
                        })}
                    {isLong && (
                      <Badge variant="outline" className="gap-1">
                        {itemsRest.length}+
                      </Badge>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormDescription>Digite ingredientes do prato.</FormDescription>
              <FormMessage />
            </FormItem>

            <CreateNewIngredientDialog
              fields={field.value}
              onRequestClose={() => {
                setCreateIngredientDialogOpen(false)
              }}
            />
          </Dialog>
        )
      }}
    />
  )
}
