import { auth } from '@/auth'
import { CreateCategory } from '@/components/create-category'
import { UpdateDishForm } from '@/components/forms/update-dish'
import { Category, Dish } from '@/lib/types/definitions'

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

async function getDishBySlug(slug: string, token: string): Promise<Dish> {
  const response = await fetch(`http://localhost:3333/dishes/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()

  return data.dish
}

export default async function SettingsProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await auth()

  if (!session) {
    return
  }

  const token = session.user.access_token

  const [categories, dish] = await Promise.all([
    getCategories(token),
    getDishBySlug(params.slug, token),
  ])

  return (
    <div className="space-y-6 py-10">
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
