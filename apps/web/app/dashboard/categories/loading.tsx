import { CategoryCard } from '@/components/cards'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Layout } from '@/components/layout'
import { PaginationSkeleton } from '@/components/skeletons'

export default function CategoriesLoading() {
  return (
    <Layout>
      <Layout.Header
        heading="Categorias"
        text="Crie e gerencie as categorias associadas aos pratos."
      >
        <CreateCategory />
      </Layout.Header>

      <div className="divide-border-200 divide-y rounded-md border">
        <CategoryCard.Skeleton />
        <CategoryCard.Skeleton />
        <CategoryCard.Skeleton />
      </div>

      <PaginationSkeleton />
    </Layout>
  )
}
