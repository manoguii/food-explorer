import { Either, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'

interface FetchFilteredDishesUseCaseRequest {
  query: string
  page: number
}

type FetchFilteredDishesUseCaseResponse = Either<
  null,
  {
    dishes: DishWithDetails[]
  }
>

@Injectable()
export class FetchFilteredDishesUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    query,
    page,
  }: FetchFilteredDishesUseCaseRequest): Promise<FetchFilteredDishesUseCaseResponse> {
    const { dishes } = await this.dishRepository.findManyByQuery(query, {
      page,
    })

    return right({
      dishes,
    })
  }
}
