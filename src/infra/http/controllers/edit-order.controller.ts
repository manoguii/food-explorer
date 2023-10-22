import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditOrderUseCase } from '@/domain/restaurant/application/use-cases/edit-order-dishes'

const editOrderBodySchema = z.object({
  items: z.array(
    z.object({
      dishId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/:orderId')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Patch()
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { items } = body

    const userId = user.sub

    const result = await this.editOrder.execute({
      dishes: items,
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
