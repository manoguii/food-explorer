import { Either, right } from '@/core/either'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'
import { Injectable } from '@nestjs/common'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'

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
