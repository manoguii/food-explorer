import { Either, right } from '@/core/either'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'
import { Injectable } from '@nestjs/common'
import { DishWithAttachments } from '../../enterprise/entities/value-objects/dish-with-attachments'

interface FetchFavoriteDishesUseCaseRequest {
  clientId: string
  page: number
}

type FetchFavoriteDishesUseCaseResponse = Either<
  null,
  {
    favoriteDishes: DishWithAttachments[]
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
