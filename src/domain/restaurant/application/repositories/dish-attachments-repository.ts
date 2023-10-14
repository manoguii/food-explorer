import { DishAttachment } from '../../enterprise/entities/dish-attachment'

export interface DishAttachmentsRepository {
  findManyByDishId(dishId: string): Promise<DishAttachment[]>
  deleteManyByDishId(dishId: string): Promise<void>
}
