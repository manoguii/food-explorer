import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'

const editDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  ingredients: z.array(z.string()),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editDishBodySchema)

type EditDishBodySchema = z.infer<typeof editDishBodySchema>

@Controller('/dishes/:id')
export class EditDishController {
  constructor(private editDish: EditDishUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: EditDishBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') dishId: string,
  ) {
    console.log({ body })
    const { description, name, price, ingredients, attachmentsIds } = body

    const userId = user.sub
    console.log('userId', userId)

    const result = await this.editDish.execute({
      name,
      price,
      description,
      ingredients,
      attachmentsIds,
      dishId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
