import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CartRepository } from '../repositories/cart-repository'
import { Injectable } from '@nestjs/common'

interface DeleteCartUseCaseRequest {
  cartId: string
}

type DeleteCartUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    cartId,
  }: DeleteCartUseCaseRequest): Promise<DeleteCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    await this.cartRepository.delete(cart)

    return right(null)
  }
}
