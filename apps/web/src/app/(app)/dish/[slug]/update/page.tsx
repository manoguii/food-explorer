import { getAuthToken } from '@/app/actions'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CreateCategory } from '@/components/forms/dialog/create-category'
import { UpdateDishForm } from '@/components/forms/update-dish'
import { fetchCategories, getDishBySlug } from '@/lib/data'

export default async function SettingsProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const token = await getAuthToken()

  const [categories, dish] = await Promise.all([
    fetchCategories(token),
    getDishBySlug(params.slug, token),
  ])

  return (
    <div className="space-y-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          {
            label: `Prato ${dish.name}`,
            href: `/dish/${dish.slug}`,
          },
          {
            label: `Atualizar ${dish.name}`,
            href: `/dish/${dish.slug}/update`,
            active: true,
          },
        ]}
      />

      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">Editar prato</h3>
          <p className="text-sm text-muted-foreground">
            Editar informações do prato
          </p>
        </div>

        <CreateCategory />
      </div>

      <UpdateDishForm categories={categories} currentDish={dish} />
    </div>
  )
}
