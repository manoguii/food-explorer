import { getAuthToken } from '@/app/actions'
import { Gallery } from '@/components/layout/dish/gallery'
import { DishDescription } from '@/components/layout/dish/product-description'
import { getDishBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

export default async function DishPage({
  params,
}: {
  params: { slug: string }
}) {
  const token = await getAuthToken()

  const dish = await getDishBySlug(params.slug, token)

  if (!dish) return notFound()

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-950 md:p-12 lg:flex-row lg:gap-8">
      <div className="h-full w-full basis-full lg:basis-4/6">
        <Gallery
          images={dish.attachments.map(
            (image: { title: string; url: string; id: string }) => ({
              src: `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${image.url}`,
              altText: image.title,
            }),
          )}
        />
      </div>

      <div className="basis-full lg:basis-2/6">
        <DishDescription dish={dish} />
      </div>
    </div>
  )
}
