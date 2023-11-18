import { Either, left, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'
import { InvalidCategoryError } from './errors/invalid-category-error'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'

interface FetchDishesByCategoryUseCaseRequest {
  category: string
  page: number
}

type FetchDishesByCategoryUseCaseResponse = Either<
  InvalidCategoryError,
  {
    dishes: DishWithDetails[]
    totalPages: number
  }
>

@Injectable()
export class FetchDishesByCategoryUseCase {
  constructor(
    private dishRepository: DishRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    category,
    page,
  }: FetchDishesByCategoryUseCaseRequest): Promise<FetchDishesByCategoryUseCaseResponse> {
    const categoryEntity = await this.categoryRepository.findByName(category)

    if (!categoryEntity) {
      return left(new InvalidCategoryError(category))
    }

    const { dishes, totalPages } = await this.dishRepository.findManyByCategory(
      categoryEntity,
      {
        page,
      },
    )

    return right({
      dishes,
      totalPages,
    })
  }
}
