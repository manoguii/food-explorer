import { getAuthToken } from '@/app/actions'
import { DishSlides } from '@/app/dashboard/(home)/dish-slide'
import { Hero } from '@/app/dashboard/(home)/hero'
import { fetchDishesByCategories } from '@/lib/data'

export default async function Home() {
  const token = await getAuthToken()
  const { dishes } = await fetchDishesByCategories(token, [
    'Saladas',
    'Sobremesas',
    'Refeições',
  ])

  return (
    <div className="space-y-8">
      <Hero />
      <div className="space-y-6">
        {dishes.map(({ category, items }) => (
          <div key={category}>
            <h4 className="text-2xl font-semibold">{category}</h4>
            <DishSlides dishes={items} />
          </div>
        ))}
      </div>
    </div>
  )
}
