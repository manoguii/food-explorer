import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchOrdersUseCase } from '@/domain/restaurant/application/use-cases/fetch-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderWithDetailsPresenter } from '../presenters/order-with-details-presenter'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'

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
export class FetchOrdersController {
  constructor(private fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(
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
}
