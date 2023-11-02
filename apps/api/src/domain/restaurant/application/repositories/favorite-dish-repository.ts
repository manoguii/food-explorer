import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'
import { DishWithAttachments } from '../../enterprise/entities/value-objects/dish-with-attachments'

export abstract class FavoriteDishRepository {
  abstract findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<DishWithAttachments[]>

  abstract addFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
  abstract removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
}
