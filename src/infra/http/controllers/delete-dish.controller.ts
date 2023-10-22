import { BadRequestException, Controller, Delete, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteDishUseCase } from '@/domain/restaurant/application/use-cases/delete-dish'

@Controller('/dishes/:dishId')
export class DeleteDishController {
  constructor(private deleteDish: DeleteDishUseCase) {}

  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('dishId') dishId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteDish.execute({
      dishId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
