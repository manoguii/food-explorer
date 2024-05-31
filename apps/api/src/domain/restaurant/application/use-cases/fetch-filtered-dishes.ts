import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'
import { DishRepository } from '../repositories/dish-repository'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'

interface FetchFilteredDishesUseCaseRequest {
  clientId: string
  query: string
  page: number
}

type FetchFilteredDishesUseCaseResponse = Either<
  null,
  {
    dishes: DishWithDetails[]
    totalPages: number
  }
>

@Injectable()
export class FetchFilteredDishesUseCase {
  constructor(
    private dishRepository: DishRepository,
    private favoriteDishRepository: FavoriteDishRepository,
  ) {}

  async execute({
    query,
    clientId,
    page,
  }: FetchFilteredDishesUseCaseRequest): Promise<FetchFilteredDishesUseCaseResponse> {
    const { dishes, totalPages } = await this.dishRepository.findManyByQuery(
      query,
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
