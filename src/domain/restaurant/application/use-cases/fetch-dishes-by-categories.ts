import { Either, left, right } from '@/core/either'
import {
  DishRepository,
  FindManyByCategoriesResponse,
} from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'
import { InvalidCategoryError } from './errors/invalid-category-error'

interface FetchDishesByCategoriesUseCaseRequest {
  categories: string[]
  page: number
}

type FetchDishesByCategoriesUseCaseResponse = Either<
  InvalidCategoryError,
  {
    dishes: FindManyByCategoriesResponse[]
  }
>

@Injectable()
export class FetchDishesByCategoriesUseCase {
  constructor(
    private dishRepository: DishRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    categories,
    page,
  }: FetchDishesByCategoriesUseCaseRequest): Promise<FetchDishesByCategoriesUseCaseResponse> {
    for (const categoryName of categories) {
      const category = await this.categoryRepository.findByName(categoryName)

      if (!category) {
        return left(new InvalidCategoryError(categoryName))
      }
    }

    const categoriesEntities =
      await this.categoryRepository.findManyByName(categories)

    const dishes = await this.dishRepository.findManyByCategories(
      categoriesEntities,
      {
        page,
      },
    )

    return right({
      dishes,
    })
  }
}
