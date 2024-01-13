import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { GetCartByIdUseCase } from '@/domain/restaurant/application/use-cases/get-cart-by-id'
import { CartWithDetailsPresenter } from '../presenters/cart-with-details-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Cart')
@Controller('/cart/:id')
export class GetCartByIdController {
  constructor(private getCartById: GetCartByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getCartById.execute({
      cartId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const cart = result.value.cart

    return { cart: CartWithDetailsPresenter.toHTTP(cart) }
  }
}
