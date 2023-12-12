import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditOrderUseCase } from '@/domain/restaurant/application/use-cases/edit-order'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'
import { Role } from '@/infra/auth/roles-enum'
import { Roles } from '@/infra/auth/roles-decorator'

const editOrderBodySchema = z.object({
  label: z.enum(['TABLE', 'DELIVERY', 'TAKEOUT']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@ApiTags('Orders')
@Controller('/orders/:orderId')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Roles(Role.ADMIN)
  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('orderId') orderId: string,
  ) {
    const { label, priority } = body

    const result = await this.editOrder.execute({
      orderId,
      label,
      priority,
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
