import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { DishAttachment } from '@/domain/restaurant/enterprise/entities/dish-attachment'

export class InMemoryDishAttachmentsRepository
  implements DishAttachmentsRepository
{
  public items: DishAttachment[] = []

  async createMany(attachments: DishAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: DishAttachment[]): Promise<void> {
    const dishAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = dishAttachments
  }

  async findManyByDishId(dishId: string) {
    const dishAttachments = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    return dishAttachments
  }

  async deleteManyByDishId(dishId: string) {
    const dishAttachments = this.items.filter(
      (item) => item.dishId.toString() !== dishId,
    )

    this.items = dishAttachments
  }
}
