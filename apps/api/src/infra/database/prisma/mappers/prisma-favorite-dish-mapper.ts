import { Prisma, FavoriteDishes as PrismaFavoriteDish } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'

export class PrismaFavoriteDishMapper {
  static toDomain(raw: PrismaFavoriteDish[]): FavoriteDish[] {
    return raw.map((favoriteDish) => {
      return FavoriteDish.create(
        {
          dishId: new UniqueEntityID(favoriteDish.dishId),
          clientId: new UniqueEntityID(favoriteDish.userId),
        },
        new UniqueEntityID(favoriteDish.id),
      )
    })
  }

  static toPrisma(
    favoriteDish: FavoriteDish,
  ): Prisma.FavoriteDishesUncheckedCreateInput {
    return {
      id: favoriteDish.id.toString(),
      dishId: favoriteDish.dishId.toString(),
      userId: favoriteDish.clientId.toString(),
    }
  }
}
