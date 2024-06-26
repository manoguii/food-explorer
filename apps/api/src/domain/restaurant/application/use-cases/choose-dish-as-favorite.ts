import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FavoriteDish } from '../../enterprise/entities/favorite-dish'
import { FavoriteDishRepository } from '../repositories/favorite-dish-repository'
import { ConflictExceptionError } from './errors/conflict-exception-error'

interface ChooseDishAsFavoriteUseCaseRequest {
  clientId: string
  dishId: string
  page: number
}

type ChooseDishAsFavoriteUseCaseResponse = Either<
  ConflictExceptionError,
  {
    favoriteDish: FavoriteDish
    totalPages: number
  }
>

@Injectable()
export class ChooseDishAsFavoriteUseCase {
  constructor(private favoriteDishRepository: FavoriteDishRepository) {}

  async execute({
    dishId,
    clientId,
    page,
  }: ChooseDishAsFavoriteUseCaseRequest): Promise<ChooseDishAsFavoriteUseCaseResponse> {
    const { favorites, totalPages } =
      await this.favoriteDishRepository.findManyByClientId(clientId, { page })

    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite.dishId.toString() === dishId,
    )

    if (isAlreadyFavorite) {
      return left(new ConflictExceptionError(dishId))
    }

    const favoriteDish = FavoriteDish.create({
      dishId: new UniqueEntityID(dishId),
      clientId: new UniqueEntityID(clientId),
    })

    await this.favoriteDishRepository.addFavoriteDish(favoriteDish)

    return right({
      favoriteDish,
      totalPages,
    })
  }
}
