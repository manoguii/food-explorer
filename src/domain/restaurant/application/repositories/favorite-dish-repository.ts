import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'

export interface FavoriteDishRepository {
  findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<FavoriteDish[]>
  addFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
  removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
}
