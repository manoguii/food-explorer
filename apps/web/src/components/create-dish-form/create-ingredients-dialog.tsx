import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '../../lib/schema'
import { toast } from '@/components/ui/use-toast'

interface CreateNewIngredientDialogProps {
  onRequestClose: () => void
  fields: {
    value: string
  }[]
}

export function CreateNewIngredientDialog({
  onRequestClose,
  fields,
}: CreateNewIngredientDialogProps) {
  const [ingredient, setIngredient] = React.useState('')

  const form = useFormContext<CreateDishFormValues>()

  const { remove, insert } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  function handleCreateIngredient(ingredient: string) {
    const ingredientExists = fields.find(
      (item) => item.value.toLowerCase() === ingredient.toLowerCase(),
    )

    if (ingredientExists) {
      return toast({
        title: 'Ingrediente já adicionado',
        description: 'Esse ingrediente já foi adicionado ao prato.',
      })
    }

    insert(fields.length - 1, { value: ingredient })

    onRequestClose()
  }

  return (
    <DialogContent className="outline-none sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Criar um novo ingrediente</DialogTitle>

        <div className="space-y-3">
          <DialogDescription>
            Lembre que um prato obrigatoriamente precisa estar associado a pelo
            menos tres{' '}
            <span className="font-semibold text-accent-foreground">
              ingredientes
            </span>
            .
          </DialogDescription>
          <DialogDescription className="flex items-center">
            <AlertCircle className="mr-2 inline h-4 w-4" />
            <span>
              Os{' '}
              <span className="font-semibold text-accent-foreground">
                ingredientes
              </span>{' '}
              adicionados ao prato são:
            </span>
          </DialogDescription>

          <ol className="flex flex-wrap items-center gap-1">
            {fields.map((item, index) => {
              return (
                <li key={item.value}>
                  <Badge key={item.value} variant="outline" className="gap-1">
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
                </li>
              )
            })}
          </ol>
        </div>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-baseline gap-4">
          <Label htmlFor="ingredient" className="text-right">
            Novo ingrediente
          </Label>
          <div className="col-span-3 space-y-4">
            <Input
              id="ingredient"
              placeholder="Digite um ingrediente"
              onChange={(e) => setIngredient(e.target.value)}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </DialogTrigger>
        <Button
          className="w-24"
          type="submit"
          onClick={() => handleCreateIngredient(ingredient)}
        >
          Criar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
