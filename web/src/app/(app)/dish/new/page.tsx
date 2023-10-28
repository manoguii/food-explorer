import { Separator } from '@/components/ui/separator'
import { ProfileForm } from './profile-form'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 p-10">
      <div>
        <h3 className="text-lg font-medium">Adicionar Prato</h3>
        <p className="text-sm text-muted-foreground">
          Adicione um novo prato ao seu cardápio.
        </p>
      </div>

      <Separator />

      <ProfileForm />
    </div>
  )
}
