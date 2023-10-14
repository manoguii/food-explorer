import { Either, right } from '@/core/either'
import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface FetchRecentDishUseCaseRequest {
  page: number
}

type FetchRecentDishUseCaseResponse = Either<
  null,
  {
    dish: Dish[]
  }
>

export class FetchRecentDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    page,
  }: FetchRecentDishUseCaseRequest): Promise<FetchRecentDishUseCaseResponse> {
    const dish = await this.dishRepository.findManyRecent({ page })

    return right({
      dish,
    })
  }
}
