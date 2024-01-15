import { Either, left, right } from '@/core/either'
import { DishRepository } from '../repositories/dish-repository'
import { Injectable } from '@nestjs/common'
import { CartRepository } from '../repositories/cart-repository'
import { CartItemsRepository } from '../repositories/cart-item-repository'
import { PaymentService } from '../payment/payment-service'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CreateCheckoutSessionUseCaseRequest {
  cartId: string
}

type CreateCheckoutSessionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    checkoutSessionId: string
  }
>

@Injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    private dishRepository: DishRepository,
    private cartRepository: CartRepository,
    private cartItemsRepository: CartItemsRepository,
    private stripeApi: PaymentService,
  ) {}

  async execute({
    cartId,
  }: CreateCheckoutSessionUseCaseRequest): Promise<CreateCheckoutSessionUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const cartItems = await this.cartItemsRepository.findManyByCartId(cartId)

    const lineItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const dish = await this.dishRepository.findById(
          cartItem.dishId.toString(),
        )

        if (!dish) {
          throw new ResourceNotFoundError()
        }

        return {
          dish,
          quantity: cartItem.quantity,
        }
      }),
    )

    const checkoutSessionId =
      await this.stripeApi.createCheckoutSession(lineItems)

    return right({
      checkoutSessionId,
    })
  }
}
