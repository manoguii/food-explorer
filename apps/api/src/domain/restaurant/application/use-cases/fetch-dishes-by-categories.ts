import { Either, left, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'
import { InvalidCategoryError } from './errors/invalid-category-error'
import { DishWithAttachments } from '../../enterprise/entities/value-objects/dish-with-attachments'

interface FetchDishesByCategoriesUseCaseRequest {
  categories: string[]
  page: number
}

type FetchDishesByCategoriesUseCaseResponse = Either<
  InvalidCategoryError,
  {
    dishes: {
      category: string
      items: DishWithAttachments[]
    }[]
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
