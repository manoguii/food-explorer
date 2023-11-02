import { auth } from '@/auth'
import { CreateCategory } from '@/components/create-category'
import { CreateDishForm } from '@/components/forms/create-dish'
import { Category } from '@/lib/types/definitions'

async function getCategories(token: string): Promise<Category[]> {
  const response = await fetch('http://localhost:3333/categories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ['Categories'],
    },
  })

  const { categories } = await response.json()

  return categories
}

export default async function SettingsProfilePage() {
  const session = await auth()

  if (!session) {
    return
  }

  const categories = await getCategories(session.user.access_token)

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

      <CreateDishForm categories={categories} />
    </div>
  )
}
