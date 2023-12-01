import { BadRequestException, Controller, Get } from '@nestjs/common'
import { FetchRecentOrderUseCase } from '@/domain/restaurant/application/use-cases/fetch-recent-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '../presenters/order-presenter'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Orders')
@Controller('/orders')
export class FetchRecentOrderController {
  constructor(private fetchRecentOrder: FetchRecentOrderUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchRecentOrder.execute({
      clientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.order

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
