import { getAuthToken } from '@/app/actions'
import { DishCard } from '@/components/cards'
import { fetchDishesByCategories } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const token = await getAuthToken()
  const decodedParam = decodeURIComponent(params.category)
  const { dishes } = await fetchDishesByCategories(token, [
    decodedParam.charAt(0).toUpperCase() + decodedParam.slice(1),
  ])

  const items = dishes[0].items

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  )
}