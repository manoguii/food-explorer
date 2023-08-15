import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'

interface GetDishBySlugUseCaseRequest {
  slug: string
}

interface GetDishBySlugUseCaseResponse {
  dish: Dish
}

export class GetDishBySlugUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    slug,
  }: GetDishBySlugUseCaseRequest): Promise<GetDishBySlugUseCaseResponse> {
    const dish = await this.dishRepository.findBySlug(slug)

    if (!dish) {
      throw new Error('Dish not found !')
    }

    return { dish }
  }
}
