import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDishMapper } from '../mappers/prisma-dish-mapper'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'
import { PrismaDishWithDetailsMapper } from '../mappers/prisma-dish-with-details-mapper'
import { Category } from '@/domain/restaurant/enterprise/entities/category'
import { DishWithAttachments } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-attachments'
import { PrismaDishWithAttachmentsMapper } from '../mappers/prisma-dish-with-attachments-mapper'

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

  async findManyByCategories(
    categories: Category[],
    params: PaginationParams,
  ): Promise<
    {
      category: string
      items: DishWithAttachments[]
    }[]
  > {
    const dishes = await this.prisma.dish.findMany({
      where: {
        categoryId: {
          in: categories.map((category) => category.id.toString()),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
      include: {
        category: true,
        ingredients: true,
        attachments: true,
      },
    })

    return dishes.reduce(
      (acc, dish) => {
        const category = dish.category.name
        const item = PrismaDishWithAttachmentsMapper.toDomain(dish)
        const categoryIndex = acc.findIndex((c) => c.category === category)
        if (categoryIndex === -1) {
          acc.push({ category, items: [item] })
        } else {
          acc[categoryIndex].items.push(item)
        }
        return acc
      },
      [] as { category: string; items: DishWithAttachments[] }[],
    )
  }

  async findManyRecent({ page }: PaginationParams): Promise<Dish[]> {
    const dishes = await this.prisma.dish.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
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

    await this.prisma.dish.delete({
      where: {
        id: data.id,
      },
    })
  }
}