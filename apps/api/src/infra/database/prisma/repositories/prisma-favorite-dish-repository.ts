import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'
import { PrismaFavoriteDishMapper } from '../mappers/prisma-favorite-dish-mapper'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'
import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { PrismaDishWithDetailsMapper } from '../mappers/prisma-dish-with-details-mapper'

@Injectable()
export class PrismaFavoriteDishRepository implements FavoriteDishRepository {
  constructor(
    private prisma: PrismaService,
    private dishAttachmentsRepository: DishAttachmentsRepository,
    private dishIngredientsRepository: DishIngredientsRepository,
  ) {}

  async findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<{
    favorites: DishWithDetails[]
    totalPages: number
  }> {
    const perPage = 10

    const totalFavoriteDishes = await this.prisma.favoriteDishes.count({
      where: {
        userId: clientId,
      },
    })

    const favoriteDishes = await this.prisma.favoriteDishes.findMany({
      where: {
        userId: clientId,
      },
      include: {
        dish: {
          include: {
            attachments: true,
            category: true,
            ingredients: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (params.page - 1) * perPage,
    })

    const dishes = favoriteDishes.map((favoriteDish) => favoriteDish.dish)

    const totalPages = Math.ceil(totalFavoriteDishes / perPage)

    return {
      favorites: dishes.map(PrismaDishWithDetailsMapper.toDomain),
      totalPages,
    }
  }

  async findOneByDishIdAndClientId(
    dishId: string,
    clientId: string,
  ): Promise<FavoriteDish | null> {
    const favoriteDish = await this.prisma.favoriteDishes.findFirst({
      where: {
        dishId,
        userId: clientId,
      },
    })

    if (!favoriteDish) {
      return null
    }

    return PrismaFavoriteDishMapper.toDomain([favoriteDish])[0]
  }

  async findAllByClientId(clientId: string): Promise<FavoriteDish[]> {
    const favoriteDishes = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
      select: {
        favoriteDishes: {
          include: {
            dish: {
              include: {
                attachments: true,
              },
            },
          },
        },
      },
    })

    if (!favoriteDishes) {
      return []
    }

    return PrismaFavoriteDishMapper.toDomain(favoriteDishes.favoriteDishes)
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
