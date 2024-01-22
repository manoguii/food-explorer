'use client'

import * as React from 'react'
import { updateCategory } from '@/db/mutations/update-category'
import { Pencil, Save } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { cn } from '@/lib/utils'

import { LoadingDots } from '../loading-dots'
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

export function UpdateCategoryForm({
  category,
}: {
  category: {
    name: string
    id: string
  }
}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(updateCategory, initialState)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-xs" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <form
          action={async (formData: FormData) => {
            await formAction(formData)
            if (formRef.current) formRef.current.reset()
          }}
          ref={formRef}
          className="grid gap-4 py-4"
        >
          <DialogHeader>
            <DialogTitle>Atualizar categoria</DialogTitle>
            <DialogDescription>
              Atualize o nome da categoria, lembre-se que o nome deve ser único
              e todos os pratos associados a essa categoria serão atualizados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="update-category">Nome da categoria</Label>
            <Input
              id="update-category"
              name="categoryName"
              defaultValue={category.name}
              placeholder="Digite o nome da categoria"
            />
            <input type="hidden" name="categoryId" value={category.id} />

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
      aria-label="Salvar categoria"
      aria-disabled={pending}
      disabled={pending}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault()
      }}
    >
      {pending ? (
        <LoadingDots className="bg-primary-foreground" />
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </>
      )}
    </Button>
  )
}
