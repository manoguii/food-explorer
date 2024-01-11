import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { UpdateCategoryForm } from '@/components/forms/update-category'

export default async function UpdateCategoryPage({
  params,
  searchParams,
}: {
  params: { category: string }
  searchParams: { name: string }
}) {
  return (
    <Dashboard>
      <Dashboard.Header
        heading="Editar categoria"
        text={`Editar categoria ${searchParams.name}`}
      >
        <CreateCategory />
      </Dashboard.Header>
      <Dashboard.Content>
        <UpdateCategoryForm
          category={{
            id: params.category,
            name: searchParams.name,
          }}
        />
      </Dashboard.Content>
    </Dashboard>
  )
}
