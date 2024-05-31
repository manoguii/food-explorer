import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'

interface FetchFavoriteDishesUseCaseRequest {
  clientId: string
  page: number
}

type FetchFavoriteDishesUseCaseResponse = Either<
  null,
  {
    favoriteDishes: DishWithDetails[]
    totalPages: number
  }
>

@Injectable()
export class FetchFavoriteDishesUseCase {
  constructor(private favoriteDishRepository: FavoriteDishRepository) {}

  async execute({
    clientId,
    page,
  }: FetchFavoriteDishesUseCaseRequest): Promise<FetchFavoriteDishesUseCaseResponse> {
    const { favorites, totalPages } =
      await this.favoriteDishRepository.findManyByClientId(clientId, { page })

    return right({
      favoriteDishes: favorites,
      totalPages,
    })
  }
}
