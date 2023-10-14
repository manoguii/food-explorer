import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'

export class InMemoryFavoriteDishRepository implements FavoriteDishRepository {
  public items: FavoriteDish[] = []

  async findManyByClientId(
    clientId: string,
    { page }: PaginationParams,
  ): Promise<FavoriteDish[]> {
    const itemsPerPage = 20

    const favoriteDish = this.items
      .filter((item) => item.clientId.toString() === clientId)
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)

    return favoriteDish
  }

  async addFavoriteDish(favoriteDish: FavoriteDish): Promise<void> {
    this.items.push(favoriteDish)
  }

  async removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void> {
    const favoriteDishes = this.items.filter(
      (item) => item.clientId.toString() !== favoriteDish.clientId.toString(),
    )

    this.items = favoriteDishes
  }
}
