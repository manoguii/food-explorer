import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { CategoryRepository } from '@/domain/restaurant/application/repositories/category-repository'
import { Category } from '@/domain/restaurant/enterprise/entities/category'

import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findMany({ page }: PaginationParams): Promise<{
    categories: Category[]
    totalPages: number
  }> {
    const perPage = 10

    const totalCategories = await this.prisma.category.count()

    const rawCategories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    const categories = rawCategories.map(PrismaCategoryMapper.toDomain)
    const totalPages = Math.ceil(totalCategories / perPage)

    return {
      categories,
      totalPages,
    }
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.create({
      data,
    })
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.update({
      where: {
        id: category.id.toString(),
      },
      data,
    })
  }

  async delete(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.delete({
      where: {
        id: data.id,
      },
    })
  }
}
