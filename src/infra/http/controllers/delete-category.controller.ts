import { BadRequestException, Controller, Delete, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'

@Controller('/categories/:categoryId')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('categoryId') categoryId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteCategory.execute({
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
