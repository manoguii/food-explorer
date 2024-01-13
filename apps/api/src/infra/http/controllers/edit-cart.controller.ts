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
import { EditCartUseCase } from '@/domain/restaurant/application/use-cases/edit-cart'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

const EditCartBodySchema = z.object({
  items: z.array(
    z.object({
      dishId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(EditCartBodySchema)

type EditCartBodySchema = z.infer<typeof EditCartBodySchema>

@ApiTags('Carts')
@Controller('/carts/:cartId')
export class EditCartController {
  constructor(private EditCart: EditCartUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditCartBodySchema,
    @Param('cartId') cartId: string,
  ) {
    const { items } = body

    const result = await this.EditCart.execute({
      cartId,
      dishes: items,
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
