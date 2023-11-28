import Grid from "./grid"
import { Skeleton } from "./ui/skeleton"

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-900/80 before:to-transparent"

export function CardSkeleton({ favoriteCard }: { favoriteCard?: boolean }) {
  return (
    <div>
      {/* Image */}
      <div
        className={`${shimmer} relative mb-4 flex aspect-video min-h-full flex-col justify-between overflow-hidden rounded-lg border bg-card shadow-sm`}
      ></div>

      {/* Title */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="ml-auto h-5 w-10" />
      </div>

      {/* Description */}
      <Skeleton className="mt-2 h-3 w-72" />

      {/* Ingredients */}
      <div className="my-4 flex flex-wrap items-center gap-1">
        <Skeleton className="h-[19px] w-16 rounded-full" />
        <Skeleton className="h-[19px] w-20 rounded-full" />
        <Skeleton className="h-[19px] w-14 rounded-full" />
        <Skeleton className="h-[19px] w-14 rounded-full" />
        <Skeleton className="h-[19px] w-20 rounded-full" />
      </div>

      {/* Add to cart */}
      {!favoriteCard && (
        <div className="mt-auto flex">
          <Skeleton className="h-10 w-48" />
        </div>
      )}
    </div>
  )
}

export function CardsSkeleton({
  favoriteCard = false,
}: {
  favoriteCard?: boolean
}) {
  const skeletonQuantity = Array.from({ length: 6 })

  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skeletonQuantity.map((_, i) => (
        <Grid.Item key={i}>
          <CardSkeleton favoriteCard={favoriteCard} />
        </Grid.Item>
      ))}
    </Grid>
  )
}
