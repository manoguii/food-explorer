import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'

interface DeleteDishFromFavoritesUseCaseRequest {
  dishId: string
  clientId: string
}

type DeleteDishFromFavoritesUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

@Injectable()
export class DeleteDishFromFavoritesUseCase {
  constructor(private favoriteDishRepository: FavoriteDishRepository) {}

  async execute({
    dishId,
    clientId,
  }: DeleteDishFromFavoritesUseCaseRequest): Promise<DeleteDishFromFavoritesUseCaseResponse> {
    const dishAttachment =
      await this.favoriteDishRepository.findOneByDishIdAndClientId(
        dishId,
        clientId,
      )

    if (!dishAttachment) {
      return left(new ResourceNotFoundError())
    }

    await this.favoriteDishRepository.removeFavoriteDish(dishAttachment)

    return right(null)
  }
}
