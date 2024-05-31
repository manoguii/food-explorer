import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { CartWithDetails } from '../../enterprise/entities/value-objects/cart-with-details'
import { CartRepository } from '../repositories/cart-repository'

interface GetCartByIdUseCaseRequest {
  cartId: string
}

type GetCartByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    cart: CartWithDetails
  }
>

@Injectable()
export class GetCartByIdUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    cartId,
  }: GetCartByIdUseCaseRequest): Promise<GetCartByIdUseCaseResponse> {
    const cart = await this.cartRepository.findByIdWithDetails(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    return right({
      cart,
    })
  }
}
