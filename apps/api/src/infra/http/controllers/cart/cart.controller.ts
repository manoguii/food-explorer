import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AddDishToCartUseCase } from '@/domain/restaurant/application/use-cases/add-dish-to-cart'
import { CreateCartUseCase } from '@/domain/restaurant/application/use-cases/create-cart'
import { DeleteDishToCartUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-to-cart'
import { EditCartUseCase } from '@/domain/restaurant/application/use-cases/edit-cart'
import { GetCartByIdUseCase } from '@/domain/restaurant/application/use-cases/get-cart-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CartPresenter } from '../../presenters/cart-presenter'
import { CartWithDetailsPresenter } from '../../presenters/cart-with-details-presenter'

const addDishToCartBodySchema = z.object({
  dishId: z.string(),
  quantity: z.number(),
})

const deleteDishToCartBodySchema = z.object({
  dishId: z.string(),
})

const editCartBodySchema = z.object({
  item: z.object({
    dishId: z.string(),
    quantity: z.number(),
  }),
})

const addDishToCartBodyValidationPipe = new ZodValidationPipe(
  addDishToCartBodySchema,
)
const deleteDishToCartBodyValidationPipe = new ZodValidationPipe(
  deleteDishToCartBodySchema,
)
const editCartBodyValidationPipe = new ZodValidationPipe(editCartBodySchema)

type EditCartBodySchema = z.infer<typeof editCartBodySchema>
type AddDishToCartBodySchema = z.infer<typeof addDishToCartBodySchema>
type DeleteDishToCartBodySchema = z.infer<typeof deleteDishToCartBodySchema>

@ApiTags('Carts')
@Controller('/cart')
export class CartController {
  constructor(
    private createCart: CreateCartUseCase,
    private addDishToCart: AddDishToCartUseCase,
    private deleteDishToCart: DeleteDishToCartUseCase,
    private getCartById: GetCartByIdUseCase,
    private editCart: EditCartUseCase,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.getCartById.execute({
      cartId: id,
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

    const cart = result.value.cart

    return { cart: CartWithDetailsPresenter.toHTTP(cart) }
  }

  @Post()
  async create(@CurrentUser() user: UserPayload) {
    const result = await this.createCart.execute({
      clientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const cart = result.value.cart

    return { cart: CartPresenter.toHTTP(cart) }
  }

  @Post(':cartId')
  async addToCart(
    @Body(addDishToCartBodyValidationPipe) body: AddDishToCartBodySchema,
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

  @Put(':cartId')
  async edit(
    @Body(editCartBodyValidationPipe) body: EditCartBodySchema,
    @Param('cartId') cartId: string,
  ) {
    const { item } = body

    const result = await this.editCart.execute({
      cartId,
      dish: item,
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

  @Delete(':cartId')
  async deleteToCart(
    @Body(deleteDishToCartBodyValidationPipe) body: DeleteDishToCartBodySchema,
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
