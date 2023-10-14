import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'

const createDishBodySchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  categoryId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createDishBodySchema)

type CreateDishBodySchema = z.infer<typeof createDishBodySchema>

@Controller('/dishes')
export class CreateDishController {
  constructor(private createDish: CreateDishUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateDishBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { description, name, price, categoryId } = body
    const userId = user.sub
    console.log('userId', userId)

    const result = await this.createDish.execute({
      name,
      price,
      description,
      categoryId,
      ingredientIds: [],
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
