import { CreateDishForm } from './create-dish-form'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 p-14">
      <div>
        <h3 className="text-lg font-medium">Criar um novo prato</h3>
        <p className="text-sm text-muted-foreground">
          Adicione um novo prato ao cardápio.
        </p>
      </div>

      <CreateDishForm />
    </div>
  )
}
