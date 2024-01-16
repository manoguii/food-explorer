import { Skeleton } from './ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

export const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/80 dark:before:via-gray-900/80 before:to-transparent'

export function TableSkeleton() {
  return (
    <div className="divide-border-200 divide-y rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead className="px-0">
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-44" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="h-16"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

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

function DataTableToolbarSkeleton({
  isUserTable = false,
}: {
  isUserTable?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <div className="h-8 w-[150px] rounded-md border lg:w-[250px]" />
        <FacetedFilterSkeleton />
        {!isUserTable && <FacetedFilterSkeleton />}
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <DataTableToolbarSkeleton />

      <TableSkeleton />
    </div>
  )
}

export function FoodDataTableSkeleton() {
  return (
    <div className="space-y-4">
      <DataTableToolbarSkeleton isUserTable />

      <div className="divide-border-200 divide-y rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead className="px-0">
                <Skeleton className="h-5 w-44" />
              </TableHead>
              <TableHead className="w-44">
                <Skeleton className="h-5 w-44" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="h-16"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function FacetedFilterSkeleton() {
  return <div className="h-8 w-[98px] rounded-md border border-dashed" />
}

export function GallerySkeleton() {
  return (
    <div className="flex flex-col items-start justify-center gap-4 sm:flex-row">
      <div className="relative aspect-square h-full max-h-[450px] w-full max-w-[450px] overflow-hidden">
        <div className="aspect-square h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <ul className="flex flex-row items-center justify-center gap-2 py-1 sm:flex-col lg:mb-0">
        <li className="h-20 w-20">
          <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </li>
        <li className="h-20 w-20">
          <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </li>
        <li className="h-20 w-20">
          <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </li>
      </ul>
    </div>
  )
}
