import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'
import { Category, Dish, Ingredient } from '@prisma/client'

interface DishWithDetailsProps extends Dish {
  category: Category
  ingredients: Ingredient[]
}

export class PrismaDishWithDetailsMapper {
  static toDomain(raw: DishWithDetailsProps): DishWithDetails {
    return DishWithDetails.create({
      dishId: new UniqueEntityID(raw.id),
      category: raw.category.name,
      ingredients: raw.ingredients.map((ingredient) => ingredient.name),
      price: raw.price,
      slug: raw.slug,
      name: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
