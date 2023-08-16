import { Either, left, right } from '@/core/either'
import { Price } from '../../enterprise/entities/value-objects/price'
import { DishRepository } from '../repositories/dish-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditDishUseCaseRequest {
  dishId: string
  name: string
  description: string
  category: string
  ingredients: string[]
  price: number
}

type EditDishUseCaseResponse = Either<ResourceNotFoundError, {}>

export class EditDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    dishId,
    category,
    description,
    ingredients,
    name,
    price,
  }: EditDishUseCaseRequest): Promise<EditDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    dish.name = name
    dish.description = description
    dish.category = category
    dish.ingredients = ingredients
    dish.price = Price.fromCents(price)

    await this.dishRepository.save(dish)

    return right({})
  }
}
