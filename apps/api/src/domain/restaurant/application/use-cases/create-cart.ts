import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { CartRepository } from '../repositories/cart-repository'
import { Injectable } from '@nestjs/common'

interface CreateCartUseCaseRequest {
  clientId: string
}

type CreateCartUseCaseResponse = Either<
  null,
  {
    cart: Cart
  }
>

@Injectable()
export class CreateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    clientId,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const cart = Cart.create({
      clientId: new UniqueEntityID(clientId),
    })

    await this.cartRepository.create(cart)

    return right({
      cart,
    })
  }
}
