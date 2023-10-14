import { Either, right } from '@/core/either'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'

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
