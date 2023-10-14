import { Dish as PrismaDish, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'

export class PrismaDishMapper {
  static toDomain(raw: PrismaDish): Dish {
    return Dish.create(
      {
        name: raw.name,
        categoryId: new UniqueEntityID(raw.categoryId),
        description: raw.description,
        price: Price.create(raw.price),
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(dish: Dish): Prisma.DishUncheckedCreateInput {
    return {
      id: dish.id.toString(),
      name: dish.name,
      categoryId: dish.categoryId.toString(),
      description: dish.description,
      price: dish.price,
      slug: dish.slug.value,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
