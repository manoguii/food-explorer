import { BadRequestException, Controller, Post } from '@nestjs/common'
import { CreateCartUseCase } from '@/domain/restaurant/application/use-cases/create-cart'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiTags } from '@nestjs/swagger'
import { CartPresenter } from '../presenters/cart-presenter'

@ApiTags('Carts')
@Controller('/cart')
export class CreateCartController {
  constructor(private createCart: CreateCartUseCase) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log('user', user)
    const result = await this.createCart.execute({
      clientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const cart = result.value.cart

    return { cart: CartPresenter.toHTTP(cart) }
  }
}
