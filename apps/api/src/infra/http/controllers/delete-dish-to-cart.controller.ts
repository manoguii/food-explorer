import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { DeleteDishToCartUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-to-cart'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

const deleteDishToCartBodySchema = z.object({
  dishId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteDishToCartBodySchema)

type DeleteDishToCartBodySchema = z.infer<typeof deleteDishToCartBodySchema>

@ApiTags('Carts')
@Controller('/cart/:cartId')
export class DeleteDishToCartController {
  constructor(private deleteDishToCart: DeleteDishToCartUseCase) {}

  @Delete()
  async handle(
    @Body(bodyValidationPipe) body: DeleteDishToCartBodySchema,
    @Param('cartId') cartId: string,
  ) {
    const { dishId } = body

    const result = await this.deleteDishToCart.execute({
      cartId,
      dishId,
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
