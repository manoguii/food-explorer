import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DishAttachment,
  DishAttachmentProps,
} from '@/domain/restaurant/enterprise/entities/dish-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeDishAttachment(
  override: Partial<DishAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const dishAttachment = DishAttachment.create(
    {
      dishId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return dishAttachment
}

@Injectable()
export class DishAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDishAttachment(
    data: Partial<DishAttachmentProps> = {},
  ): Promise<DishAttachment> {
    const dishAttachment = makeDishAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: dishAttachment.attachmentId.toString(),
      },
      data: {
        dishId: dishAttachment.dishId.toString(),
      },
    })

    return dishAttachment
  }
}
