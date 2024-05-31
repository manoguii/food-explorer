import { Injectable } from '@nestjs/common'

import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { DishAttachment } from '@/domain/restaurant/enterprise/entities/dish-attachment'

import { PrismaDishAttachmentMapper } from '../mappers/prisma-dish-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDishAttachmentsRepository
  implements DishAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByDishId(dishId: string): Promise<DishAttachment[]> {
    const dishAttachment = await this.prisma.attachment.findMany({
      where: {
        dishId,
      },
    })

    return dishAttachment.map(PrismaDishAttachmentMapper.toDomain)
  }

  async deleteManyByDishId(dishId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        dishId,
      },
    })
  }

  async createMany(attachments: DishAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaDishAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: DishAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }
}
