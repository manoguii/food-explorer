import { useForm } from 'react-hook-form'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { NewCategoryFormSchema, newCategoryFormSchema } from '../schema'

interface CreateNewCategoryDialogProps {
  onRequestClose: () => void
}

export function CreateNewCategoryDialog({
  onRequestClose,
}: CreateNewCategoryDialogProps) {
  const { toast } = useToast()
  // const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<NewCategoryFormSchema>({
    resolver: zodResolver(newCategoryFormSchema),
    defaultValues: {
      category: '',
    },
  })

  // const { mutateAsync: createCategory } = useMutation(
  //   async (category: string) => {
  //     await axios.post('/api/category', {
  //       category,
  //     })
  //   },
  //   {
  //     onSuccess() {
  //       queryClient.invalidateQueries(['category'])
  //     },
  //   },
  // )

  async function handleCreateCategory({ category }: NewCategoryFormSchema) {
    try {
      console.log(category)
      // await createCategory(category)

      reset()
      onRequestClose()
    } catch (err) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: `An error ocurred while trying to create the category. Maybe you're trying to create a duplicated category.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="outline-none sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Criar nova categoria</DialogTitle>
        <div className="space-y-3">
          <DialogDescription>
            Lembre que um prato obrigatoriamente precisa estar associado a uma
            <span className="font-semibold text-accent-foreground">
              categoria
            </span>
            .
          </DialogDescription>
          <DialogDescription className="flex items-center">
            <AlertCircle className="mr-2 inline h-4 w-4" />
            <span>
              Use alguns exemplos de{' '}
              <span className="font-semibold text-accent-foreground">
                categorias
              </span>{' '}
              a seguir:
            </span>
          </DialogDescription>
          <ol className="space-y-2">
            <li className="text-sm text-muted-foreground">
              <Badge variant="outline">Bebidas</Badge> - categoria para bebidas
            </li>
            <li className="text-sm text-muted-foreground">
              <Badge variant="outline">Sobremesas</Badge> - referente a doces
            </li>
            <li className="text-sm text-muted-foreground">
              <Badge variant="outline">Massas</Badge> - categoria para massas
            </li>
          </ol>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateCategory)} className="w-full">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-baseline gap-4">
            <Label htmlFor="category" className="text-right">
              Nova categoria
            </Label>
            <div className="col-span-3 space-y-4">
              <Input
                id="category"
                placeholder="Sua nova categoria"
                disabled={isSubmitting}
                {...register('category')}
              />
              {errors.category && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogTrigger>
          <Button className="w-24" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Criar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
