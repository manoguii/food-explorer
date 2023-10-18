import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Dish, DishProps } from '@/domain/restaurant/enterprise/entities/dish'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDishMapper } from '@/infra/database/prisma/mappers/prisma-dish-mapper'

export function makeDish(
  override: Partial<DishProps> = {},
  id?: UniqueEntityID,
) {
  const dish = Dish.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Price.create(Number(faker.commerce.price())),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return dish
}

@Injectable()
export class DishFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDish(data: Partial<DishProps> = {}): Promise<Dish> {
    const dish = makeDish(data)

    await this.prisma.dish.create({
      data: PrismaDishMapper.toPrisma(dish),
    })

    return dish
  }
}
