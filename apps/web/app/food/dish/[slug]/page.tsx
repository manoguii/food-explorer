import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getDishBySlug } from '@/db/queries/get-dish-by-slug'

import { Gallery } from '@/components/food/gallery'
import { DishDescription } from '@/components/food/product-description'
import { GallerySkeleton } from '@/components/skeletons'

export const runtime = 'edge'

const IMAGE_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_BASE_URL

export default async function DishPage({
  params,
}: {
  params: { slug: string }
}) {
  const dish = await getDishBySlug(params.slug)

  if (!dish) return notFound()

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-gray-50 dark:bg-gray-950 md:p-6 lg:flex-row">
      <div className="h-full w-full basis-full lg:basis-2/3">
        <Suspense key={params.slug} fallback={<GallerySkeleton />}>
          <Gallery
            images={dish.attachments.map(
              (image: { title: string; url: string; id: string }) => ({
                src: `${IMAGE_URL}/${image.url}`,
                altText: image.title,
              }),
            )}
          />
        </Suspense>
      </div>

      <div className="basis-full lg:basis-2/4">
        <DishDescription dish={dish} />
      </div>
    </div>
  )
}
