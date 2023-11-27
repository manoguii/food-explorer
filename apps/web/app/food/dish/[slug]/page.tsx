import { notFound } from "next/navigation"

import { getDishBySlug } from "@/lib/data"
import { Gallery } from "@/components/gallery"
import { DishDescription } from "@/components/product-description"
import { getAuthToken } from "@/app/actions"

export const runtime = "edge"

export default async function DishPage({
  params,
}: {
  params: { slug: string }
}) {
  const token = await getAuthToken()

  const dish = await getDishBySlug(params.slug, token)

  if (!dish) return notFound()

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-gray-50 dark:bg-gray-950 md:p-6 lg:flex-row">
      <div className="h-full w-full basis-full lg:basis-2/3">
        <Gallery
          images={dish.attachments.map(
            (image: { title: string; url: string; id: string }) => ({
              src: `https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${image.url}`,
              altText: image.title,
            })
          )}
        />
      </div>

      <div className="basis-full lg:basis-2/4">
        <DishDescription dish={dish} />
      </div>
    </div>
  )
}
