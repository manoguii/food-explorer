import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/restaurant/enterprise/entities/attachment'
import { DishWithAttachments } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-attachments'
import {
  Attachment as PrismaAttachment,
  Category,
  Dish,
  Ingredient,
} from '@prisma/client'

interface DishWithAttachmentsProps extends Dish {
  category: Category
  ingredients: Ingredient[]
  attachments: PrismaAttachment[]
}

export class PrismaDishWithAttachmentsMapper {
  static toDomain(raw: DishWithAttachmentsProps): DishWithAttachments {
    return DishWithAttachments.create({
      dishId: new UniqueEntityID(raw.id),
      name: raw.name,
      description: raw.description,
      price: raw.price,
      slug: raw.slug,
      attachments: raw.attachments.map((attachment) =>
        Attachment.create({
          title: attachment.title,
          url: attachment.url,
        }),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
