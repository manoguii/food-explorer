import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchOrdersUseCase } from '@/domain/restaurant/application/use-cases/fetch-orders'
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/get-order-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { OrderWithDetailsPresenter } from '../../presenters/order-with-details-presenter'

const searchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

const searchParamsValidationPipe = new ZodValidationPipe(searchParamsSchema)

type SearchParamsSchema = z.infer<typeof searchParamsSchema>

@ApiTags('Orders')
@Controller('/orders')
export class OrderController {
  constructor(
    private fetchOrders: FetchOrdersUseCase,
    private getOrderById: GetOrderByIdUseCase,
  ) {}

  @Get()
  async fetch(
    @CurrentUser() user: UserPayload,
    @Query(searchParamsValidationPipe)
    searchParams: SearchParamsSchema,
  ) {
    const { page } = searchParams

    const result = await this.fetchOrders.execute({
      clientId: user.sub,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(OrderWithDetailsPresenter.toHTTP),
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
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
