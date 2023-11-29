import { fetchDishesByCategory } from "@/lib/data"
import { getAuthToken } from "@/app/actions"
import { CarouselList } from "@/app/food/(home)/carousel"

export async function FeaturedCategoriesList() {
  const token = await getAuthToken()
  const [{ dishes: salads }, { dishes: meals }, { dishes: desserts }] =
    await Promise.all([
      fetchDishesByCategory(token, "Saladas", 1),
      fetchDishesByCategory(token, "Refeições", 1),
      fetchDishesByCategory(token, "Sobremesas", 1),
    ])

  const dishes = [
    { dishes: desserts, category: "Sobremesas" },
    { dishes: salads, category: "Saladas" },
    { dishes: meals, category: "Refeições" },
  ]

  return (
    <div className="space-y-14">
      {dishes.map(({ dishes, category }) => (
        <CarouselList key={category} dishes={dishes} category={category} />
      ))}
    </div>
  )
}
