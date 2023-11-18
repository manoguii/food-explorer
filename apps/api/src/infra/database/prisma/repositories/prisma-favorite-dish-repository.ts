import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { FavoriteDish } from '@/domain/restaurant/enterprise/entities/favorite-dish'
import { PrismaFavoriteDishMapper } from '../mappers/prisma-favorite-dish-mapper'
import { DishWithAttachments } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-attachments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/restaurant/enterprise/entities/attachment'

@Injectable()
export class PrismaFavoriteDishRepository implements FavoriteDishRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<{
    favorites: DishWithAttachments[]
    totalPages: number
  }> {
    const perPage = 10

    const totalFavoriteDishes = await this.prisma.favoriteDishes.count({
      where: {
        userId: clientId,
      },
    })

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
          orderBy: {
            createdAt: 'desc',
          },
          take: perPage,
          skip: (params.page - 1) * perPage,
        },
      },
    })

    const favorites = favoriteDishes?.favoriteDishes.map((raw) => {
      return DishWithAttachments.create({
        dishId: new UniqueEntityID(raw.dish.id),
        name: raw.dish.name,
        description: raw.dish.description,
        price: raw.dish.price,
        slug: raw.dish.slug,
        attachments: raw.dish.attachments.map((attachment) =>
          Attachment.create({
            title: attachment.title,
            url: attachment.url,
          }),
        ),
        createdAt: raw.dish.createdAt,
        updatedAt: raw.dish.updatedAt,
      })
    })

    if (!favorites) {
      return {
        favorites: [],
        totalPages: 0,
      }
    }

    const totalPages = Math.ceil(totalFavoriteDishes / perPage)

    return {
      favorites,
      totalPages,
    }
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
