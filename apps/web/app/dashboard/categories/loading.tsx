import { CategoryItem } from '@/components/cards'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Layout } from '@/components/layout'

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
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
        <CategoryItem.Skeleton />
      </div>
    </Layout>
  )
}
