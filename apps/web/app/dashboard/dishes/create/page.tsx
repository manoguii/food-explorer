import { fetchCategories } from '@/db/fetch'

import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { CreateCategoryForm } from '@/components/forms/create-category'
import { CreateDishForm } from '@/components/forms/create-dish'

export default async function SettingsProfilePage() {
  const { categories } = await fetchCategories()

  return (
    <Dashboard>
      <Dashboard.Header
        heading="Criar um novo prato"
        text="Adicione um novo prato ao cardápio."
      >
        <CreateCategoryForm />
      </Dashboard.Header>
      <Dashboard.Content>
        <CreateDishForm categories={categories} />
      </Dashboard.Content>
    </Dashboard>
  )
}
