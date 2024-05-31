import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/get-order-by-id'

import { OrderWithDetailsPresenter } from '../presenters/order-with-details-presenter'

@ApiTags('Order')
@Controller('/order/:id')
export class GetOrderByIdController {
  constructor(private getOrderById: GetOrderByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getOrderById.execute({
      orderId: id,
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

    const order = result.value.order

    return { order: OrderWithDetailsPresenter.toHTTP(order) }
  }
}
