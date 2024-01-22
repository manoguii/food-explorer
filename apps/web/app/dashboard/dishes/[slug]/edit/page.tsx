import { notFound } from 'next/navigation'
import { fetchCategories } from '@/db/queries/fetch-categories'
import { getDishBySlug } from '@/db/queries/get-dish-by-slug'

import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { CreateCategoryForm } from '@/components/forms/create-category'
import { UpdateDishForm } from '@/components/forms/update-dish'

export default async function UpdateDishPage({
  params,
}: {
  params: { slug: string }
}) {
  const [{ categories }, dish] = await Promise.all([
    fetchCategories(),
    getDishBySlug(params.slug),
  ])

  if (!dish) {
    notFound()
  }

  return (
    <Dashboard>
      <Dashboard.Header
        heading="Editar prato"
        text={`Editar informações do prato ${dish.name}`}
      >
        <CreateCategoryForm />
      </Dashboard.Header>

      <Dashboard.Content>
        <UpdateDishForm categories={categories} currentDish={dish} />
      </Dashboard.Content>
    </Dashboard>
  )
}
