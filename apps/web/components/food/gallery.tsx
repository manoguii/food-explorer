'use client'

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { GridTileImage } from '@/components/food/grid'
import { buttonVariants } from '@/components/ui/button'
import { createUrl } from '@/lib/utils'

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const imageSearchParam = searchParams.get('image')
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0

  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0
  nextSearchParams.set('image', nextImageIndex.toString())
  const nextUrl = createUrl(pathname, nextSearchParams)

  const previousSearchParams = new URLSearchParams(searchParams.toString())
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1
  previousSearchParams.set('image', previousImageIndex.toString())
  const previousUrl = createUrl(pathname, previousSearchParams)

  const buttonClassName = buttonVariants({
    variant: 'ghost',
    size: 'icon',
  })

  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:flex-row">
      <div className="relative aspect-square h-full max-h-[450px] w-full max-w-[450px] overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="aspect-square h-full w-full rounded-lg object-cover"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-lg border border-white bg-gray-50/80 text-gray-500 backdrop-blur dark:border-black dark:bg-gray-900/80">
              <Link
                aria-label="Previous dish image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-gray-500"></div>
              <Link
                aria-label="Next dish image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="flex flex-row items-center justify-center gap-2 py-1 sm:flex-col lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex
            const imageSearchParams = new URLSearchParams(
              searchParams.toString(),
            )

            imageSearchParams.set('image', index.toString())

            return (
              <li key={image.src} className="h-20 w-20">
                <Link
                  aria-label="Enlarge dish image"
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
