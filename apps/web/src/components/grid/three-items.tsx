import Link from 'next/link'
import { GridTileImage } from './tile'
import { Dish } from '@/lib/types/definitions'

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Dish
  size: 'full' | 'half'
  priority?: boolean
}) {
  return (
    <div
      className={
        size === 'full'
          ? 'md:col-span-4 md:row-span-2'
          : 'md:col-span-2 md:row-span-1'
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/food/dish/${item.slug}`}
      >
        <GridTileImage
          src={`https://pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev/${item.attachments[0].url}`}
          fill
          sizes={
            size === 'full'
              ? '(min-width: 768px) 66vw, 100vw'
              : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.name}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name as string,
            amount: item.price.toString(),
            currencyCode: 'BRL',
          }}
        />
      </Link>
    </div>
  )
}

// export async function ThreeItemGrid() {
//   // Collections that start with `hidden-*` are hidden from the search page.
//   const homepageItems = await getCollectionDishs({
//     collection: 'hidden-homepage-featured-items',
//   })

//   if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null

//   const [firstDish, secondDish, thirdDish] = homepageItems

//   return (
//     <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
//       <ThreeItemGridItem size="full" item={firstDish} priority={true} />
//       <ThreeItemGridItem size="half" item={secondDish} priority={true} />
//       <ThreeItemGridItem size="half" item={thirdDish} />
//     </section>
//   )
// }

export { ThreeItemGridItem }
