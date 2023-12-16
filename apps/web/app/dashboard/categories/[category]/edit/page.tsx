import { CreateCategory } from '@/components/forms/dialog/create-category'
import { UpdateCategoryForm } from '@/components/forms/update-category'
import { Layout } from '@/components/layout'

export default async function UpdateCategoryPage({
  params,
  searchParams,
}: {
  params: { category: string }
  searchParams: { name: string }
}) {
  return (
    <Layout>
      <Layout.Header
        heading="Editar categoria"
        text={`Editar categoria ${searchParams.name}`}
      >
        <CreateCategory />
      </Layout.Header>

      <UpdateCategoryForm
        category={{
          id: params.category,
          name: searchParams.name,
        }}
      />
    </Layout>
  )
}
