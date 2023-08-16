import { Dish } from '../../enterprise/entities/dish'
import { Price } from '../../enterprise/entities/value-objects/price'
import { DishRepository } from '../repositories/dish-repository'

interface CreateDishUseCaseRequest {
  name: string
  description: string
  category: string
  ingredients: string[]
  price: number
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
    price,
  }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
    const dish = Dish.create({
      name,
      description,
      price: Price.fromCents(price),
      category,
      ingredients,
    })

    await this.dishRepository.create(dish)

    return { dish }
  }
}
