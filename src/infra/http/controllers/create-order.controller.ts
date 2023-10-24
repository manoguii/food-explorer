import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOrderUseCase } from '@/domain/restaurant/application/use-cases/create-order'

const createOrderBodySchema = z.object({
  items: z.array(
    z.object({
      dishId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    const { items } = body

    const result = await this.createOrder.execute({
      dishes: items,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
