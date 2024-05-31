import { Attachment as PrismaDishAttachment, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishAttachment } from '@/domain/restaurant/enterprise/entities/dish-attachment'

export class PrismaDishAttachmentMapper {
  static toDomain(raw: PrismaDishAttachment): DishAttachment {
    if (!raw.dishId) {
      throw new Error('DishId is required')
    }

    return DishAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        dishId: new UniqueEntityID(raw.dishId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: DishAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        dishId: attachments[0].dishId.toString(),
      },
    }
  }
}
