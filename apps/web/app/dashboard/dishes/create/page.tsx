import { fetchCategories } from '@/lib/data'
import { CreateDishForm } from '@/components/forms/create-dish'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { Layout } from '@/components/layout'

export default async function SettingsProfilePage() {
  const { categories } = await fetchCategories()

  return (
    <Layout>
      <Layout.Header
        heading="Criar um novo prato"
        text="Adicione um novo prato ao cardápio."
      >
        <CreateCategory />
      </Layout.Header>

      <CreateDishForm categories={categories} />
    </Layout>
  )
}
