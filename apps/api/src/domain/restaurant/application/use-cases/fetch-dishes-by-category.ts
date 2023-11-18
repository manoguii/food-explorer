import { Either, left, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'
import { InvalidCategoryError } from './errors/invalid-category-error'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'

interface FetchDishesByCategoryUseCaseRequest {
  category: string
  clientId: string
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
    private favoriteDishRepository: FavoriteDishRepository,
  ) {}

  async execute({
    category,
    clientId,
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

    const favoriteDishes =
      await this.favoriteDishRepository.findAllByClientId(clientId)

    dishes.forEach((dish) => {
      const isFavorite = favoriteDishes.some((favoriteDish) =>
        favoriteDish.dishId.equals(dish.dishId),
      )

      dish.isFavorite = isFavorite
    })

    return right({
      dishes,
      totalPages,
    })
  }
}
