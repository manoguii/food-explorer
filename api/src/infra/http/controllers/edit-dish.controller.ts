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
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

const editDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  ingredients: z.array(z.string()),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editDishBodySchema)

type EditDishBodySchema = z.infer<typeof editDishBodySchema>

@ApiTags('Dish')
@Controller('/dishes/:id')
export class EditDishController {
  constructor(private editDish: EditDishUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditDishBodySchema,
    @Param('id') dishId: string,
  ) {
    const { description, name, price, ingredients, attachmentsIds } = body

    const result = await this.editDish.execute({
      name,
      price,
      description,
      ingredients,
      attachmentsIds,
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
