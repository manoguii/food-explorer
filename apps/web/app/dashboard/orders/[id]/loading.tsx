import { Dot } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from '@/components/skeletons'

export default function OrderDetailsLoading() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />

        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-32" />
          <Dot />
          <Skeleton className="h-5 w-40" />
          <Dot />
          <Skeleton className="h-5 w-36" />
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-5 w-40" />
          <DataTableSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <div>
              <CardHeader className="flex flex-row items-center space-y-0">
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid gap-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </CardContent>
            </div>
            <Separator />
            <div>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid gap-1">
                  <Skeleton className="h-2 w-40" />
                  <Skeleton className="h-2 w-40" />
                </div>
              </CardContent>
            </div>
            <Separator />
            <div>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Skeleton className="h-2 w-40" />
                <Skeleton className="h-2 w-40" />
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
