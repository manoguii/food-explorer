import { AlertCircle, Stars, X } from 'lucide-react'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { DishFormValues } from '@/lib/schemas'

interface CreateIngredientsProps {
  type: 'create' | 'update'
  onRequestClose: () => void
  fields: {
    value: string
  }[]
}

export function CreateIngredients({
  onRequestClose,
  fields,
  type,
}: CreateIngredientsProps) {
  const message = type === 'create' ? messages.create : messages.update

  const [ingredient, setIngredient] = React.useState('')

  const form = useFormContext<DishFormValues>()

  const { remove, insert } = useFieldArray({
    name: 'ingredients',
    control: form.control,
  })

  function handleCreateIngredient(ingredient: string) {
    const ingredientArray = ingredient.split(',')

    const ingredientExists = ingredientArray.some((ingredient) => {
      const ingredientAlreadyExists = fields.some((item) => {
        return item.value === ingredient.trim()
      })

      if (ingredientAlreadyExists) {
        return toast({
          title: `Ingrediente ${ingredient} já adicionado`,
          description: `O ingrediente ${ingredient} já foi adicionado ao prato`,
          variant: 'destructive',
        })
      }

      return ingredientAlreadyExists
    })

    if (ingredientExists) {
      return
    }

    ingredientArray.forEach((ingredient) => {
      insert(0, { value: ingredient.trim() })
    })

    onRequestClose()
  }

  return (
    <D.DialogContent className="outline-none sm:max-w-[600px]">
      <D.DialogHeader>
        <D.DialogTitle>{message.title}</D.DialogTitle>

        <div className="space-y-3">
          <D.DialogDescription>
            Lembre que um prato obrigatoriamente precisa estar associado a pelo
            menos tres{' '}
            <span className="font-semibold text-accent-foreground">
              ingredientes
            </span>
            .
          </D.DialogDescription>
          <D.DialogDescription className="flex items-center text-start">
            <Stars className="mr-2 hidden h-4 w-4 sm:inline" />
            <span>
              Para criar vários{' '}
              <span className="font-semibold text-accent-foreground">
                ingredientes
              </span>{' '}
              ao mesmo tempo, separe-os por vírgula. <br />
              Exemplo:{' '}
              <span className="font-semibold text-accent-foreground">
                Batata, Cenoura, Alface
              </span>
            </span>
          </D.DialogDescription>

          <D.DialogDescription className="flex items-center text-start">
            <AlertCircle className="mr-2 hidden h-4 w-4 sm:inline" />
            <span>
              Os{' '}
              <span className="font-semibold text-accent-foreground">
                ingredientes
              </span>{' '}
              adicionados ao prato são:
            </span>
          </D.DialogDescription>

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
      </D.DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-baseline gap-4">
          <Label
            htmlFor="ingredient"
            className="col-span-3 sm:col-span-1 sm:text-right"
          >
            Novo ingrediente
          </Label>
          <div className="col-span-4 space-y-4 sm:col-span-3">
            <Input
              id="ingredient"
              placeholder="Digite um ingrediente"
              onChange={(e) => setIngredient(e.target.value)}
            />
          </div>
        </div>
      </div>
      <D.DialogFooter className="gap-2">
        <D.DialogTrigger asChild>
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </D.DialogTrigger>
        <Button
          type="submit"
          onClick={() => handleCreateIngredient(ingredient)}
        >
          Criar
        </Button>
      </D.DialogFooter>
    </D.DialogContent>
  )
}

const messages = {
  create: {
    title: 'Criar ingredientes !',
  },
  update: {
    title: 'Atualizar ingredientes !',
  },
}
