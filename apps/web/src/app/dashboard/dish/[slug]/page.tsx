import { getAuthToken } from '@/app/actions'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { AddToCart, AddToFavorite } from '@/components/buttons'
import { Badge } from '@/components/ui/badge'
import { getDishBySlug, fetchFavoriteDishes } from '@/lib/data'
import { Dish } from '@/lib/types/definitions'
import { Dot, Cookie } from 'lucide-react'
import Image from 'next/image'

export default async function Dish({ params }: { params: { slug: string } }) {
  const token = await getAuthToken()

  const [dish, favoriteDishes] = await Promise.all([
    getDishBySlug(params.slug, token),
    fetchFavoriteDishes(token),
  ])

  const isFavorite = favoriteDishes.some((item) => item.id === dish.id)

  const imageSrc = dish.attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${dish.attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Painel', href: '/dashboard' },
          {
            label: `Prato ${dish.name}`,
            href: `/dashboard/dish/${dish.slug}`,
            active: true,
          },
        ]}
      />

      <div className="grid h-full max-w-4xl grid-cols-1 place-content-center lg:max-w-5xl lg:grid-cols-2 lg:gap-x-8">
        <div className="relative col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t p-3 dark:from-gray-950/75 dark:via-gray-950/0 sm:row-start-2 sm:bg-none sm:p-0 lg:row-start-1">
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-slate-900 dark:sm:text-white md:text-3xl">
            {dish.name}
          </h1>
        </div>

        <div className="col-start-1 col-end-3 row-start-1 grid place-content-center gap-4 sm:mb-6 lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:ml-auto">
          <Image
            src={imageSrc}
            alt={dish.description}
            priority
            quality={100}
            width={400}
            height={400}
            className="aspect-square rounded-md object-cover"
          />
        </div>
        <dl className="row-start-2 mt-4 flex items-center text-sm font-medium sm:row-start-3 sm:mt-1 md:mt-2.5 lg:row-start-2">
          <dt className="sr-only">Avaliações</dt>
          <dd className="flex items-center text-indigo-600 dark:text-indigo-400">
            <AddToFavorite dishId={dish.id} isFavorite={isFavorite} />
          </dd>
          <dt className="sr-only">Categoria</dt>
          <dd className="flex items-center">
            <Dot className="mx-1 text-slate-300" />
            <Cookie className="mr-1 h-4 w-4" />
            {dish.category}
          </dd>
        </dl>
        <div className="col-start-1 row-start-3 mt-4 self-center sm:col-start-2 sm:row-span-2 sm:row-start-2 sm:mt-0 lg:col-start-1 lg:row-start-3 lg:row-end-4 lg:mt-6">
          <AddToCart dish={dish} />
        </div>
        <div className="col-start-1 mt-4 sm:col-span-2 lg:col-span-1 lg:row-start-4 lg:mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {dish.ingredients.map((item) => {
              return (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              )
            })}
          </div>

          <p className="leading-6 dark:text-slate-400">{dish.description}</p>
        </div>
      </div>
    </div>
  )
}
