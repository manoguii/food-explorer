import { fetchCategories, getDishBySlug } from "@/lib/data"
import { CreateCategory } from "@/components/forms/dialog/create-category"
import { UpdateDishForm } from "@/components/forms/update-dish"
import { getAuthToken } from "@/app/actions"

export default async function SettingsProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const token = await getAuthToken()

  const [{ categories }, dish] = await Promise.all([
    fetchCategories(token),
    getDishBySlug(params.slug, token),
  ])

  return (
    <div className="space-y-5">
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
