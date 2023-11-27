import Grid from "./grid"

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-900/80 before:to-transparent"

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex aspect-square min-h-full flex-col justify-between overflow-hidden rounded-lg border bg-card shadow-sm`}
    ></div>
  )
}

export function CardsSkeleton() {
  const skeletonQuantity = Array.from({ length: 6 })

  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skeletonQuantity.map((_, i) => (
        <Grid.Item key={i}>
          <CardSkeleton />
        </Grid.Item>
      ))}
    </Grid>
  )
}
