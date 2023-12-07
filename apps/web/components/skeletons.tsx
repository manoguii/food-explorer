import { Skeleton } from './ui/skeleton'

export function PaginationSkeleton() {
  return (
    <div className="mx-auto inline-flex">
      <Skeleton className="mr-2 h-10 w-10 rounded-md md:mr-4" />

      <div className="flex -space-x-px">
        <Skeleton className="h-10 w-10 rounded-none rounded-l-md" />
        <Skeleton className="h-10 w-10 rounded-none rounded-r-md" />
      </div>

      <Skeleton className="ml-2 h-10 w-10 rounded-md md:ml-4" />
    </div>
  )
}
