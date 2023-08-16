import { Either, left, right } from '@/core/either'
import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface FetchDishesByCategoryUseCaseRequest {
  category: string
  page: number
}

type FetchDishesByCategoryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dishes: Dish[]
  }
>

export class FetchDishesByCategoryUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    category,
    page,
  }: FetchDishesByCategoryUseCaseRequest): Promise<FetchDishesByCategoryUseCaseResponse> {
    const dishes = await this.dishRepository.findManyByCategory(category, {
      page,
    })

    if (!dishes) {
      return left(new ResourceNotFoundError())
    }

    return right({ dishes })
  }
}
