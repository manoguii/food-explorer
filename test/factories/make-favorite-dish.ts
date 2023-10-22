import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  FavoriteDish,
  FavoriteDishProps,
} from '@/domain/restaurant/enterprise/entities/favorite-dish'
import { PrismaFavoriteDishMapper } from '@/infra/database/prisma/mappers/prisma-favorite-dish-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeFavoriteDish(
  override: Partial<FavoriteDishProps> = {},
  id?: UniqueEntityID,
) {
  const favoriteDish = FavoriteDish.create(
    {
      dishId: new UniqueEntityID(),
      clientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return favoriteDish
}

@Injectable()
export class FavoriteDishFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFavoriteDish(
    data: Partial<FavoriteDishProps> = {},
  ): Promise<FavoriteDish> {
    const favoriteDish = makeFavoriteDish(data)

    await this.prisma.favoriteDishes.create({
      data: PrismaFavoriteDishMapper.toPrisma(favoriteDish),
    })

    return favoriteDish
  }
}
