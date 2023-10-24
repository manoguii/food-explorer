import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditDishStatusUseCase } from '@/domain/restaurant/application/use-cases/edit-dish-status'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

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
    @Param('orderId') orderId: string,
  ) {
    const { dishId, status } = body

    const result = await this.editDishStatus.execute({
      orderId,
      dishId,
      status,
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
  }
}
