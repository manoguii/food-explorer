// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-900/80 before:to-transparent'

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex h-96 min-h-full flex-col justify-between overflow-hidden rounded-lg border bg-card shadow-sm`}
    ></div>
  )
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}
