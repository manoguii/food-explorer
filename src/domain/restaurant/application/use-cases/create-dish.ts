import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface CreateDishUseCaseRequest {
  name: string
  description: string
  category: string
  ingredients: string[]
}

interface CreateDishUseCaseResponse {
  dish: Dish
}

export class CreateDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    name,
    description,
    category,
    ingredients,
  }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
    const dish = Dish.create({
      name,
      description,
      price: 1200,
      category,
      ingredients,
    })

    await this.dishRepository.create(dish)

    return { dish }
  }
}
