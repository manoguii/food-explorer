import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { Category } from '@/domain/restaurant/enterprise/entities/category'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'

import { PrismaDishMapper } from '../mappers/prisma-dish-mapper'
import { PrismaDishWithDetailsMapper } from '../mappers/prisma-dish-with-details-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDishRepository implements DishRepository {
  constructor(
    private prisma: PrismaService,
    private dishAttachmentsRepository: DishAttachmentsRepository,
    private dishIngredientsRepository: DishIngredientsRepository,
  ) {}

  async findById(id: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: {
        id,
      },
    })

    if (!dish) {
      return null
    }

    return PrismaDishMapper.toDomain(dish)
  }

  async findBySlug(slug: string): Promise<Dish | null> {
    const dish = await this.prisma.dish.findUnique({
      where: {
        slug,
      },
    })

    if (!dish) {
      return null
    }

    return PrismaDishMapper.toDomain(dish)
  }

  async findBySlugWithDetails(slug: string): Promise<DishWithDetails | null> {
    const dish = await this.prisma.dish.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        ingredients: true,
        attachments: true,
      },
    })

    if (!dish) {
      return null
    }

    return PrismaDishWithDetailsMapper.toDomain(dish)
  }

  async findManyByCategory(
    category: Category,
    params: PaginationParams,
  ): Promise<{
    dishes: DishWithDetails[]
    totalPages: number
  }> {
    const perPage = 10

    const totalDishes = await this.prisma.dish.count({
      where: {
        categoryId: category.id.toString(),
      },
    })

    const dishes = await this.prisma.dish.findMany({
      where: {
        categoryId: category.id.toString(),
      },
      include: {
        category: true,
        ingredients: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (params.page - 1) * perPage,
    })

    const totalPages = Math.ceil(totalDishes / perPage)

    return {
      dishes: dishes.map(PrismaDishWithDetailsMapper.toDomain),
      totalPages,
    }
  }

  async findManyByQuery(
    query: string,
    params: PaginationParams,
  ): Promise<{
    dishes: DishWithDetails[]
    totalPages: number
  }> {
    const perPage = 10

    const totalDishes = await this.prisma.dish.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    })

    const dishes = await this.prisma.dish.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        category: true,
        ingredients: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (params.page - 1) * perPage,
    })

    const totalPages = Math.ceil(totalDishes / perPage)

    return {
      dishes: dishes.map(PrismaDishWithDetailsMapper.toDomain),
      totalPages,
    }
  }

  async findManyByIds(ids: string[]): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return dishes.map(PrismaDishMapper.toDomain)
  }

  async create(dish: Dish): Promise<void> {
    const data = PrismaDishMapper.toPrisma(dish)

    await this.prisma.dish.create({
      data,
    })

    await Promise.all([
      this.dishAttachmentsRepository.createMany(dish.attachments.getItems()),
      this.dishIngredientsRepository.createMany(dish.ingredients.getItems()),
    ])
  }

  async save(dish: Dish): Promise<void> {
    const data = PrismaDishMapper.toPrisma(dish)

    await Promise.all([
      this.prisma.dish.update({
        where: {
          id: dish.id.toString(),
        },
        data,
      }),
      this.dishAttachmentsRepository.createMany(dish.attachments.getNewItems()),
      this.dishAttachmentsRepository.deleteMany(
        dish.attachments.getRemovedItems(),
      ),
      this.dishIngredientsRepository.createMany(dish.ingredients.getNewItems()),
      this.dishIngredientsRepository.deleteMany(
        dish.ingredients.getRemovedItems(),
      ),
    ])
  }

  async delete(dish: Dish): Promise<void> {
    const data = PrismaDishMapper.toPrisma(dish)

    await Promise.all([
      await this.dishAttachmentsRepository.deleteManyByDishId(
        dish.id.toString(),
      ),
      await this.dishIngredientsRepository.deleteManyByDishId(
        dish.id.toString(),
      ),
      await this.prisma.dish.delete({
        where: {
          id: data.id,
        },
      }),
    ])
  }
}
