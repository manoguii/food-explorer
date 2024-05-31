'use client'

import { Plus } from 'lucide-react'
import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { createCategory } from '@/db/mutations/create-category'
import { cn } from '@/lib/utils'

import { LoadingDots } from '../loading-dots'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const initialState = {
  message: '',
  success: true,
}

export function CreateCategoryForm() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(createCategory, initialState)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Criar categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <form
          action={async (formData: FormData) => {
            formAction(formData)
            if (formRef.current) formRef.current.reset()
          }}
          ref={formRef}
          className="grid gap-4 py-4"
        >
          <DialogHeader>
            <DialogTitle>Criar categoria</DialogTitle>

            <div className="space-y-3">
              <DialogDescription>
                Lembre que um prato obrigatoriamente precisa estar associado a
                uma{' '}
                <span className="font-semibold text-accent-foreground">
                  categoria
                </span>
                .
              </DialogDescription>
              <DialogDescription className="flex items-center text-start">
                <span>
                  Exemplos de{' '}
                  <span className="font-semibold text-accent-foreground">
                    categorias:
                  </span>{' '}
                </span>
              </DialogDescription>
              <ol className="space-y-2">
                <li className="text-start text-sm text-muted-foreground">
                  <Badge variant="outline">Bebidas</Badge> - refrigerantes,
                  cafés, vinhos, etc.
                </li>
                <li className="text-start text-sm text-muted-foreground">
                  <Badge variant="outline">Sobremesas</Badge> - petit gateau,
                  pudim, etc.
                </li>
                <li className="text-start text-sm text-muted-foreground">
                  <Badge variant="outline">Massas</Badge> - lasanha,
                  macarronada, etc.
                </li>
              </ol>
            </div>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="create-category">Nome da categoria</Label>
            <Input
              id="create-category"
              name="categoryName"
              placeholder="Digite o nome da categoria"
            />

            <p
              aria-live="polite"
              className={cn(
                'text-sm font-medium',
                state.success ? 'text-emerald-600' : 'text-destructive',
              )}
              role="status"
            >
              {state.message}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogTrigger>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      aria-label="Cria categoria"
      aria-disabled={pending}
      disabled={pending}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? (
        <LoadingDots className="mr-2" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Criar categoria
    </Button>
  )
}
