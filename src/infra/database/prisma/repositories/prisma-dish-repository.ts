import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDishMapper } from '../mappers/prisma-dish-mapper'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'

@Injectable()
export class PrismaDishRepository implements DishRepository {
  constructor(private prisma: PrismaService) {}

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
  }

  async save(dish: Dish): Promise<void> {
    const data = PrismaDishMapper.toPrisma(dish)

    await this.prisma.dish.update({
      where: {
        id: dish.id.toString(),
      },
      data,
    })
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
