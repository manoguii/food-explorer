import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentOrderUseCase } from '@/domain/restaurant/application/use-cases/fetch-recent-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '../presenters/order-presenter'
import { ApiTags } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Orders')
@Controller('/orders')
export class FetchRecentOrderController {
  constructor(private fetchRecentOrder: FetchRecentOrderUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchRecentOrder.execute({
      page,
      clientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.order
    const totalPages = result.value.totalPages

    return {
      orders: orders.map(OrderPresenter.toHTTP),
      totalPages,
    }
  }
}
