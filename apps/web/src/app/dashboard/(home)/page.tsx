import { SectionDishes } from '@/components/section-dishes'
import { Hero } from '@/components/hero'
import { getDishes } from '@/lib/data'
import { getAuthToken } from '@/app/actions'

export default async function Home() {
  const token = await getAuthToken()
  const dishes = await getDishes(token)

  return (
    <>
      <Hero />

      {dishes.dishes.map(({ category, items }) => (
        <SectionDishes key={category} title={category} dishes={items} />
      ))}
    </>
  )
}
