import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'
import { DishRepository } from '../repositories/dish-repository'

interface GetDishBySlugUseCaseRequest {
  slug: string
}

type GetDishBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dish: DishWithDetails
  }
>

@Injectable()
export class GetDishBySlugUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    slug,
  }: GetDishBySlugUseCaseRequest): Promise<GetDishBySlugUseCaseResponse> {
    const dish = await this.dishRepository.findBySlugWithDetails(slug)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    return right({
      dish,
    })
  }
}
