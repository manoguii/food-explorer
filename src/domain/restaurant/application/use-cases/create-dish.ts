import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Price } from '../../enterprise/entities/value-objects/price'
import { DishRepository } from '../repositories/dish-repository'
import { DishAttachment } from '../../enterprise/entities/dish-attachment'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'
import { DishAttachmentList } from '../../enterprise/entities/dish-attachment-list'
import { DishIngredientList } from '../../enterprise/entities/dish-ingredient-list'
import { Injectable } from '@nestjs/common'

interface CreateDishUseCaseRequest {
  name: string
  price: string
  description: string
  categoryId: string
  ingredientIds: string[]
  attachmentsIds: string[]
}

type CreateDishUseCaseResponse = Either<
  null,
  {
    dish: Dish
  }
>

@Injectable()
export class CreateDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    name,
    price,
    description,
    categoryId,
    ingredientIds,
    attachmentsIds,
  }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
    const dish = Dish.create({
      categoryId: new UniqueEntityID(categoryId),
      price: Price.create(price),
      description,
      name,
    })

    const dishAttachments = attachmentsIds.map((attachmentId) => {
      return DishAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        dishId: dish.id,
      })
    })

    const dishIngredient = ingredientIds.map((ingredientId) => {
      return DishIngredient.create({
        ingredientId: new UniqueEntityID(ingredientId),
        dishId: dish.id,
      })
    })

    dish.attachments = new DishAttachmentList(dishAttachments)
    dish.ingredients = new DishIngredientList(dishIngredient)

    await this.dishRepository.create(dish)

    return right({
      dish,
    })
  }
}
