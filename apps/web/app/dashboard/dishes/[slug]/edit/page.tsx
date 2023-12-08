import { fetchCategories, getDishBySlug } from '@/lib/data'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { UpdateDishForm } from '@/components/forms/update-dish'
import { Layout } from '@/components/layout'

export default async function SettingsProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const [{ categories }, dish] = await Promise.all([
    fetchCategories(),
    getDishBySlug(params.slug),
  ])

  return (
    <Layout>
      <Layout.Header
        heading="Editar prato"
        text={`Editar informações do prato ${dish.name}`}
      >
        <CreateCategory />
      </Layout.Header>

      <UpdateDishForm categories={categories} currentDish={dish} />
    </Layout>
  )
}
