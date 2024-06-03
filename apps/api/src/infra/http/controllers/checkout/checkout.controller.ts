import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateCheckoutSessionUseCase } from '@/domain/restaurant/application/use-cases/create-checkout-session'

@ApiTags('Checkout')
@Controller('/checkout')
export class CheckoutController {
  constructor(private createCheckoutSession: CreateCheckoutSessionUseCase) {}

  @Post(':cartId')
  async create(@Param('cartId') cartId: string) {
    const result = await this.createCheckoutSession.execute({
      cartId,
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

    const checkoutSessionUrl = result.value.checkoutSessionUrl

    return { checkoutSessionUrl }
  }
}
