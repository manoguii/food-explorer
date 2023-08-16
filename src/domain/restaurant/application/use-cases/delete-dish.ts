import { DishRepository } from '../repositories/dish-repository'

interface DeleteDishUseCaseRequest {
  dishId: string
}

interface DeleteDishUseCaseResponse {}

export class DeleteDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    dishId,
  }: DeleteDishUseCaseRequest): Promise<DeleteDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      throw new Error('Dish not found !')
    }

    await this.dishRepository.delete(dish)

    return {}
  }
}
