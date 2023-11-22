import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ChooseDishAsFavoriteUseCase } from '@/domain/restaurant/application/use-cases/choose-dish-as-favorite'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ConflictExceptionError } from '@/domain/restaurant/application/use-cases/errors/conflict-exception-error'
import { ApiTags } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Dish')
@Controller('/dishes/:dishId/favorite')
export class ChooseDishAsFavoriteController {
  constructor(private chooseDishAsFavorite: ChooseDishAsFavoriteUseCase) {}

  @Patch()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
    @Param('dishId') dishId: string,
  ) {
    const result = await this.chooseDishAsFavorite.execute({
      page,
      dishId,
      clientId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictExceptionError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
