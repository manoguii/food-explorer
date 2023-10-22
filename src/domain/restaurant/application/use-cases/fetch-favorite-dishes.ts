import { Either, right } from '@/core/either'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'
import { Injectable } from '@nestjs/common'

interface FetchFavoriteDishesUseCaseRequest {
  clientId: string
  page: number
}

type FetchFavoriteDishesUseCaseResponse = Either<
  null,
  {
    favoriteDishes: FavoriteDish[]
  }
>

@Injectable()
export class FetchFavoriteDishesUseCase {
  constructor(private favoriteDishRepository: FavoriteDishRepository) {}

  async execute({
    clientId,
    page,
  }: FetchFavoriteDishesUseCaseRequest): Promise<FetchFavoriteDishesUseCaseResponse> {
    const favoriteDishes = await this.favoriteDishRepository.findManyByClientId(
      clientId,
      { page },
    )

    return right({
      favoriteDishes,
    })
  }
}
