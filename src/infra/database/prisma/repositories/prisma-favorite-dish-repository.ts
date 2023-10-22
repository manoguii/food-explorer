import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'
import { PrismaFavoriteDishMapper } from '../mappers/prisma-favorite-dish-mapper'

@Injectable()
export class PrismaFavoriteDishRepository implements FavoriteDishRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByClientId(
    clientId: string,
    { page }: PaginationParams,
  ): Promise<FavoriteDish[]> {
    const favoriteDishes = await this.prisma.favoriteDishes.findMany({
      where: {
        userId: clientId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return PrismaFavoriteDishMapper.toDomain(favoriteDishes)
  }

  async addFavoriteDish(favoriteDish: FavoriteDish): Promise<void> {
    const data = PrismaFavoriteDishMapper.toPrisma(favoriteDish)

    await this.prisma.favoriteDishes.create({
      data,
    })
  }

  async removeFavoriteDish(favoriteDish: FavoriteDish): Promise<void> {
    const data = PrismaFavoriteDishMapper.toPrisma(favoriteDish)

    await this.prisma.favoriteDishes.delete({
      where: {
        id: data.id,
      },
    })
  }
}
