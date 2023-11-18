import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'
import { DishWithAttachments } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-attachments'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryDishRepository } from './in-memory-dish-repository'

export class InMemoryFavoriteDishRepository implements FavoriteDishRepository {
  public items: FavoriteDish[] = []

  constructor(
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishRepository: InMemoryDishRepository,
  ) {}

  async findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<{ favorites: DishWithAttachments[]; totalPages: number }> {
    const perPage = 10

    const totalFavoriteDishes = this.items.filter(
      (favoriteDish) => favoriteDish.clientId.toString() === clientId,
    ).length

    const dishes = this.dishRepository.items
      .filter((item) => {
        return this.items.some(
          (favoriteDish) =>
            favoriteDish.clientId.toString() === clientId &&
            favoriteDish.dishId.toString() === item.id.toString(),
        )
      })
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((params.page - 1) * perPage, params.page * perPage)

    const items = await Promise.all(
      dishes.map(async (dish) => {
        const dishAttachments =
          await this.dishAttachmentsRepository.findManyByDishId(
            dish.id.toString(),
          )

        const attachments = await Promise.all(
          dishAttachments.map(async (dishAttachment) => {
            const attachment = this.attachmentsRepository.items.find(
              (attachment) => attachment.id.equals(dishAttachment.attachmentId),
            )

            if (!attachment) {
              throw new Error(
                'A dish cannot be created without an dish attachment !',
              )
            }

            return attachment
          }),
        )

        return DishWithAttachments.create({
          dishId: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          slug: dish.slug.value,
          attachments,
          createdAt: dish.createdAt,
          updatedAt: dish.updatedAt,
        })
      }),
    )

    const totalPages = Math.ceil(totalFavoriteDishes / perPage)

    return {
      favorites: items,
      totalPages,
    }
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
