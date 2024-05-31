import {
  Attachment as PrismaAttachment,
  Category,
  Dish,
  Ingredient,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'

interface DishWithDetailsProps extends Dish {
  category: Category
  ingredients: Ingredient[]
  attachments: PrismaAttachment[]
}

export class PrismaDishWithDetailsMapper {
  static toDomain(raw: DishWithDetailsProps): DishWithDetails {
    return DishWithDetails.create({
      dishId: new UniqueEntityID(raw.id),
      name: raw.name,
      description: raw.description,
      price: raw.price,
      slug: raw.slug,
      category: raw.category.name,
      ingredients: raw.ingredients.map((ingredient) => ingredient.name),
      attachments: raw.attachments.map((attachment) => {
        return {
          title: attachment.title,
          url: attachment.url,
          id: attachment.id,
        }
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
