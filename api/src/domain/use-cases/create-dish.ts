import { Dish } from '../entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface CreateDishUseCaseRequest {
  name: string
  description: string
  category: string
  ingredients: string[]
}

export class CreateDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    name,
    description,
    category,
    ingredients,
  }: CreateDishUseCaseRequest) {
    const dish = new Dish({ name, description, category, ingredients })

    await this.dishRepository.create(dish)

    return dish
  }
}
