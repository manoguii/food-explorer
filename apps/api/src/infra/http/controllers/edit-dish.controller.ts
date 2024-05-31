import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'
import { Roles } from '@/infra/auth/roles-decorator'
import { Role } from '@/infra/auth/roles-enum'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  ingredients: z.array(z.string()),
  categoryId: z.string().uuid(),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editDishBodySchema)

type EditDishBodySchema = z.infer<typeof editDishBodySchema>

@ApiTags('Dish')
@Controller('/dishes/:id')
export class EditDishController {
  constructor(private editDish: EditDishUseCase) {}

  @Roles(Role.ADMIN)
  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditDishBodySchema,
    @Param('id') dishId: string,
  ) {
    const {
      description,
      name,
      price,
      ingredients,
      attachmentsIds,
      categoryId,
    } = body

    const result = await this.editDish.execute({
      name,
      price,
      description,
      ingredients,
      attachmentsIds,
      dishId,
      categoryId,
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
