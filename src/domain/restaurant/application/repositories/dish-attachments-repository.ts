import { DishAttachment } from '../../enterprise/entities/dish-attachment'

export abstract class DishAttachmentsRepository {
  abstract findManyByDishId(dishId: string): Promise<DishAttachment[]>
  abstract deleteManyByDishId(dishId: string): Promise<void>
}
