import { Dish } from '../entities/dish'
import { Slug } from '../entities/value-objects/slug'
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
    const dish = Dish.create({
      name,
      description,
      price: 1200,
      category,
      ingredients,
    })

    await this.dishRepository.create(dish)

    return dish
  }
}
