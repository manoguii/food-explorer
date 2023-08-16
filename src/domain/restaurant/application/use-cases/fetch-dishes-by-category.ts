import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface FetchDishesByCategoryUseCaseRequest {
  category: string
  page: number
}

interface FetchDishesByCategoryUseCaseResponse {
  dishes: Dish[]
}

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
      throw new Error('Dish not found !')
    }

    return { dishes }
  }
}
