import { CreateCategory } from '@/components/create-category'
import { CreateDishForm } from '@/components/create-dish-form'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 py-10">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">Criar um novo prato</h3>
          <p className="text-sm text-muted-foreground">
            Adicione um novo prato ao cardápio.
          </p>
        </div>

        <CreateCategory />
      </div>

      <CreateDishForm />
    </div>
  )
}
