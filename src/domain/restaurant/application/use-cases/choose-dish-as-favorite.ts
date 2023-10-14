import { Dish } from '../../enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ClientsRepository } from '../repositories/clients-repository'

interface ChooseDishAsFavoriteUseCaseRequest {
  clientId: string
  dishId: string
}

type ChooseDishAsFavoriteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    dish: Dish
  }
>

// TODO: Pending implementation
export class ChooseDishAsFavoriteUseCase {
  constructor(
    private dishRepository: DishRepository,
    private clientRepository: ClientsRepository,
  ) {}

  async execute({
    dishId,
    clientId,
  }: ChooseDishAsFavoriteUseCaseRequest): Promise<ChooseDishAsFavoriteUseCaseResponse> {
    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    await this.dishRepository.save(dish)

    return right({
      dish,
    })
  }
}
