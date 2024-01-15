import { Category } from '@/lib/types/definitions'
import { formatDate } from '@/lib/utils'

import { UpdateCategoryForm } from '../forms/update-category'
import { Skeleton } from '../ui/skeleton'
import { DeleteCategory } from './delete-category'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <h3>{category.name}</h3>
        <span className="text-sm text-muted-foreground">
          {formatDate(category.createdAt)}
        </span>
      </div>
      <div className="flex gap-2">
        <UpdateCategoryForm category={category} />
        <DeleteCategory category={category} />
      </div>
    </div>
  )
}

CategoryCard.Skeleton = function CategoryCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="h-8 w-8 rounded-md border" />
    </div>
  )
}
