import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'

export abstract class FavoriteDishRepository {
  abstract findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<FavoriteDish[]>

  abstract addFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
  abstract removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void>
}
