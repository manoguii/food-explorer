import { notFound } from 'next/navigation'
import { fetchCategories, getDishBySlug } from '@/db/fetch'

import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { CreateCategory } from '@/components/forms/dialog/create-category'
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
        <CreateCategory />
      </Dashboard.Header>

      <Dashboard.Content>
        <UpdateDishForm categories={categories} currentDish={dish} />
      </Dashboard.Content>
    </Dashboard>
  )
}
