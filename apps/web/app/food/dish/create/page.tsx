import { fetchCategories } from '@/lib/data'
import { CreateDishForm } from '@/components/forms/create-dish'
import { CreateCategory } from '@/components/forms/dialog/create-category'

export default async function SettingsProfilePage() {
  const { categories } = await fetchCategories()

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">Criar um novo prato</h3>
          <p className="text-sm text-muted-foreground">
            Adicione um novo prato ao cardápio.
          </p>
        </div>

        <CreateCategory />
      </div>

      <CreateDishForm categories={categories} />
    </div>
  )
}
