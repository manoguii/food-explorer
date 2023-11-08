import { SectionDishes } from '@/components/section-dishes'
import { Hero } from '@/components/hero'
import { auth } from '@/auth'
import { Dish } from '@/lib/types/definitions'

interface GetDishesResponse {
  dishes: {
    category: string
    items: Dish[]
  }[]
}

async function getDishes(token: string): Promise<GetDishesResponse> {
  const response = await fetch(
    'http://localhost:3333/dish/categories?categories=Saladas&categories=Refeições&categories=Sobremesas',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ['featured-dishes'],
      },
    },
  )
  const dishes = await response.json()

  return dishes
}

export default async function Home() {
  const session = await auth()

  if (!session) return

  const {
    user: { access_token },
  } = session

  const dishes = await getDishes(access_token)

  return (
    <>
      <Hero />

      {dishes.dishes.map(({ category, items }) => (
        <SectionDishes key={category} title={category} dishes={items} />
      ))}
    </>
  )
}
