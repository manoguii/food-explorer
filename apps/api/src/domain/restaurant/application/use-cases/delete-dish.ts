import { Either, left, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteDishUseCaseRequest {
  dishId: string
}

type DeleteDishUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    dishId,
  }: DeleteDishUseCaseRequest): Promise<DeleteDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    await this.dishRepository.delete(dish)

    return right(null)
  }
}
