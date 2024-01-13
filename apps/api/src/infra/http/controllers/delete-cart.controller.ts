import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteCartUseCase } from '@/domain/restaurant/application/use-cases/delete-cart'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@ApiTags('Carts')
@Controller('/cart/:cartId')
export class DeleteCartController {
  constructor(private deleteCart: DeleteCartUseCase) {}

  @Delete()
  async handle(@Param('cartId') cartId: string) {
    const result = await this.deleteCart.execute({
      cartId,
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
