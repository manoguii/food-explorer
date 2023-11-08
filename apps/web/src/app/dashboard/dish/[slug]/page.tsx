import { getAuthToken } from '@/app/actions'
import { AddToFavorite } from '@/components/buttons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { getDishBySlug, getFavoriteDishes } from '@/lib/data'
import { Dish } from '@/lib/types/definitions'
import { Dot, Cookie } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Dish({ params }: { params: { slug: string } }) {
  const token = await getAuthToken()

  const [dish, favoriteDishes] = await Promise.all([
    getDishBySlug(params.slug, token),
    getFavoriteDishes(token),
  ])

  const isFavorite = favoriteDishes.some((item) => item.id === dish.id)

  const imageSrc = dish.attachments[0]
    ? `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${dish.attachments[0].url}`
    : '/images/food-placeholder.jpeg'

  return (
    <div className="mx-auto my-12 grid max-w-4xl grid-cols-1 lg:max-w-5xl lg:grid-cols-2 lg:gap-x-4">
      <div className="relative col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t p-3 dark:from-gray-950/75 dark:via-gray-950/0 sm:row-start-2 sm:bg-none sm:p-0 lg:row-start-1">
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-slate-900 dark:sm:text-white md:text-3xl">
          {dish.name}
        </h1>
        <p className="text-sm font-medium leading-4 text-white sm:text-slate-500 dark:sm:text-slate-400">
          Voltar
        </p>
      </div>

      <div className="col-start-1 col-end-3 row-start-1 grid place-content-center gap-4 sm:mb-6 lg:col-start-2 lg:row-span-6 lg:row-start-1">
        <Image
          src={imageSrc}
          alt={dish.description}
          priority
          quality={100}
          width={400}
          height={400}
          className="h-[300px] w-[300px] rounded-full object-cover sm:h-[400px] sm:w-[400px]"
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
        {/* <AddToCart /> */}

        <Link
          href={`/dashboard/dish/${params.slug}/update`}
          className={buttonVariants({
            variant: 'destructive',
          })}
        >
          Editar prato
        </Link>
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
  )
}
