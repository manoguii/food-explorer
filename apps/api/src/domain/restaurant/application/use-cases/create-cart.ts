import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

import { CartRepository } from '../repositories/cart-repository'
import { ClientsRepository } from '../repositories/clients-repository'

interface CreateCartUseCaseRequest {
  clientId: string
}

type CreateCartUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    cart: Cart
  }
>

@Injectable()
export class CreateCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const cartExists =
      await this.cartRepository.findEmptyCartByClientId(clientId)

    if (cartExists) {
      return right({
        cart: cartExists,
      })
    }

    const cart = Cart.create({
      clientId: new UniqueEntityID(clientId),
    })

    await this.cartRepository.create(cart)

    return right({
      cart,
    })
  }
}
