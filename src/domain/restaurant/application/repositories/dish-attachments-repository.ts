import { DishAttachment } from '../../enterprise/entities/dish-attachment'

export abstract class DishAttachmentsRepository {
  abstract createMany(attachments: DishAttachment[]): Promise<void>
  abstract deleteMany(attachments: DishAttachment[]): Promise<void>

  abstract findManyByDishId(dishId: string): Promise<DishAttachment[]>
  abstract deleteManyByDishId(dishId: string): Promise<void>
}
