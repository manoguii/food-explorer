import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { PrismaDishRepository } from './prisma/repositories/prisma-dish-repository'
import { ClientsRepository } from '@/domain/restaurant/application/repositories/clients-repository'
import { PrismaClientsRepository } from './prisma/repositories/prisma-client-repository'
import { CategoryRepository } from '@/domain/restaurant/application/repositories/category-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: DishRepository,
      useClass: PrismaDishRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [
    PrismaService,
    DishRepository,
    ClientsRepository,
    CategoryRepository,
  ],
})
export class DatabaseModule {}
