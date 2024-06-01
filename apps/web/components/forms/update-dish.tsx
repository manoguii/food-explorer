'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { updateDish } from '@/db/mutations/update-dish'
import { uploadFile } from '@/db/mutations/upload-file'
import { dishFormSchema, DishFormValues } from '@/lib/schemas'
import { Category, DishWithDetails } from '@/lib/types/definitions'

import { ButtonWithLoading } from '../button-with-loading'
import { Dialog } from '../ui/dialog'
import { CreateIngredients } from './dialog/create-ingredients'
import * as Field from './fields'

export function UpdateDishForm({
  currentDish,
  categories,
}: {
  currentDish: DishWithDetails
  categories: Category[]
}) {
  const [ingredientsDialogOpen, setIngredientsDialogOpen] =
    React.useState(false)
  const [uploadingFile, setUploadingFile] = React.useState<{
    state: 'idle' | 'uploading' | 'success' | 'error'
  }>({
    state: 'idle',
  })

  const defaultValues: Partial<DishFormValues> = {
    description: currentDish.description,
    name: currentDish.name,
    price: currentDish.price.toString(),
    category: currentDish.category,
    ingredients: currentDish.ingredients.map((ingredient) => ({
      value: ingredient,
    })),
  }

  const router = useRouter()

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  async function handleUpdateDish(data: DishFormValues) {
    let attachmentsIds = currentDish.attachments.map(
      (attachment) => attachment.id,
    )

    if (data.file) {
      let attachmentId = ''

      const formData = new FormData()
      formData.append('file', data.file)

      setUploadingFile({
        state: 'uploading',
      })

      try {
        attachmentId = await uploadFile(formData)
      } catch (error) {
        if (error instanceof Error) {
          setUploadingFile({
            state: 'error',
          })

          toast({
            title: 'Erro ao fazer upload da imagem',
            description: error.message,
            variant: 'destructive',
          })
        }
      }

      setUploadingFile({
        state: 'success',
      })

      attachmentsIds = [...attachmentsIds, attachmentId]
    }

    const categoryId = categories.find(
      (category) => category.name === data.category,
    )?.id

    if (!categoryId) {
      return toast({
        title: 'Categoria não encontrada !',
        description: `A categoria ${data.category} não foi encontrada !`,
        variant: 'destructive',
      })
    }

    const dish = {
      id: currentDish.id,
      slug: currentDish.slug,
      name: data.name,
      description: data.description,
      price: Number(data.price.replace(',', '')),
      ingredients: data.ingredients.map((ingredient) => ingredient.value),
      categoryId,
      attachmentsIds,
    }

    try {
      await updateDish(dish)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error !',
          description: error.message,
          variant: 'destructive',
        })
      }
    }

    form.reset()
    router.replace(`/dashboard/dishes`)
  }

  return (
    <Form {...form}>
      <form
        className="grid flex-1 items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(handleUpdateDish)}
      >
        <div className="grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              type="button"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {currentDish.name}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Disponível
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <ButtonWithLoading
                type="submit"
                icon="save"
                size="sm"
                isLoading={form.formState.isSubmitting}
              >
                Salvar
              </ButtonWithLoading>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Detalhes do prato</CardTitle>
                  <CardDescription>
                    Atualize os detalhes do seu prato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <Field.Name
                      placeholder="Salada de frutas"
                      description="Digite o novo nome do prato."
                    />
                    <Field.Description />
                    <Field.Price />
                  </div>
                </CardContent>
              </Card>
              <Dialog
                open={ingredientsDialogOpen}
                onOpenChange={setIngredientsDialogOpen}
              >
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Ingredientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Field.Ingredients />
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      className="gap-1"
                      onClick={() => {
                        setIngredientsDialogOpen(true)
                      }}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Criar ingrediente
                    </Button>
                  </CardFooter>
                  <CreateIngredients
                    type="update"
                    fields={form.getValues('ingredients')}
                    onRequestClose={() => {
                      setIngredientsDialogOpen(false)
                    }}
                  />
                </Card>
              </Dialog>
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Categoria do prato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <Field.Category
                      categories={categories}
                      currentCategory={currentDish.category}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Imagens do prato</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Image
                      alt={currentDish.attachments[0].title}
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src={currentDish.attachments[0].url}
                      width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {currentDish.attachments.slice(0, 3).map((attachment) => {
                        return (
                          <button key={attachment.id}>
                            <Image
                              alt={attachment.title}
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src={attachment.url}
                              width="84"
                            />
                          </button>
                        )
                      })}
                    </div>
                    <Field.File state={uploadingFile.state} />
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Archive Product</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="secondary">
                    Archive Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <ButtonWithLoading
              type="submit"
              icon="save"
              isLoading={form.formState.isSubmitting}
            >
              Salvar
            </ButtonWithLoading>
          </div>
        </div>
      </form>
    </Form>
  )
}
