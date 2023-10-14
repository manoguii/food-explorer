import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface EditDishUseCaseRequest {
  dishId: string
  name: string
  description: string
  price: string
}

type EditDishUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    dish: Dish
  }
>

export class EditDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    dishId,
    description,
    name,
    price,
  }: EditDishUseCaseRequest): Promise<EditDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    dish.name = name
    dish.price = price
    dish.description = description

    await this.dishRepository.save(dish)

    return right({
      dish,
    })
  }
}
