import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'
import { CreateCheckoutSessionUseCase } from '@/domain/restaurant/application/use-cases/create-checkout-session'

@ApiTags('Checkout')
@Controller('/checkout-session/:cartId')
export class CreateCheckoutSessionController {
  constructor(private createCheckoutSession: CreateCheckoutSessionUseCase) {}

  @Post()
  async handle(@Param('cartId') cartId: string) {
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
