import { fetchCategories } from '@/lib/data'
import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { CreateDishForm } from '@/components/forms/create-dish'
import { CreateCategory } from '@/components/forms/dialog/create-category'

export default async function SettingsProfilePage() {
  const { categories } = await fetchCategories()

  return (
    <Dashboard>
      <Dashboard.Header
        heading="Criar um novo prato"
        text="Adicione um novo prato ao cardápio."
      >
        <CreateCategory />
      </Dashboard.Header>
      <Dashboard.Content>
        <CreateDishForm categories={categories} />
      </Dashboard.Content>
    </Dashboard>
  )
}
