import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface FetchDishByCategoryUseCaseRequest {
  category: string
  page: number
}

interface FetchDishByCategoryUseCaseResponse {
  dishes: Dish[]
}

export class FetchDishByCategoryUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    category,
    page,
  }: FetchDishByCategoryUseCaseRequest): Promise<FetchDishByCategoryUseCaseResponse> {
    const dishes = await this.dishRepository.findManyByCategory(category, {
      page,
    })

    if (!dishes) {
      throw new Error('Dish not found !')
    }

    return { dishes }
  }
}
