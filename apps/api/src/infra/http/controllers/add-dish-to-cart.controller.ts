import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AddDishToCartUseCase } from '@/domain/restaurant/application/use-cases/add-dish-to-cart'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

const addDishToCartBodySchema = z.object({
  dishId: z.string(),
  quantity: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(addDishToCartBodySchema)

type AddDishToCartBodySchema = z.infer<typeof addDishToCartBodySchema>

@ApiTags('Carts')
@Controller('/cart/:cartId')
export class AddDishToCartController {
  constructor(private addDishToCart: AddDishToCartUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddDishToCartBodySchema,
    @Param('cartId') cartId: string,
  ) {
    const { dishId, quantity } = body

    const result = await this.addDishToCart.execute({
      cartId,
      dishId,
      quantity,
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
