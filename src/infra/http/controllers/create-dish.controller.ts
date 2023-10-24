import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'

const createDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categoryId: z.string(),
  ingredients: z.array(z.string()),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createDishBodySchema)

type CreateDishBodySchema = z.infer<typeof createDishBodySchema>

@Controller('/dishes')
export class CreateDishController {
  constructor(private createDish: CreateDishUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateDishBodySchema) {
    const {
      description,
      name,
      price,
      categoryId,
      ingredients,
      attachmentsIds,
    } = body

    const result = await this.createDish.execute({
      name,
      price,
      description,
      categoryId,
      ingredients,
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
