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
import { EditDishStatusUseCase } from '@/domain/restaurant/application/use-cases/edit-dish-status'

const editDishStatusBodySchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'DELIVERED', 'CANCELED']),
  dishId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDishStatusBodySchema)

type EditDishStatusBodySchema = z.infer<typeof editDishStatusBodySchema>

@Controller('/orders/:orderId/status')
export class EditDishStatusController {
  constructor(private editDishStatus: EditDishStatusUseCase) {}

  @Patch()
  async handle(
    @Body(bodyValidationPipe) body: EditDishStatusBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { dishId, status } = body

    const userId = user.sub

    const result = await this.editDishStatus.execute({
      orderId,
      dishId,
      status,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
