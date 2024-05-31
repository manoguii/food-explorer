import { PaginationParams } from '@/core/repositories/pagination-params'

import { FavoriteDish } from '../../enterprise/entities/favorite-dish'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'

export abstract class FavoriteDishRepository {
  abstract findOneByDishIdAndClientId(
    dishId: string,
    clientId: string,
  ): Promise<FavoriteDish | null>

  abstract findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<{
    favorites: DishWithDetails[]
    totalPages: number
  }>

  abstract findAllByClientId(clientId: string): Promise<FavoriteDish[]>

  abstract addFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
  abstract removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
}
