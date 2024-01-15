import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'
import { DishAttachmentsRepository } from '../repositories/dish-attachments-repository'
import { DishIngredientsRepository } from '../repositories/dish-ingredients-repository'
import { DishAttachmentList } from '../../enterprise/entities/dish-attachment-list'
import { DishIngredientList } from '../../enterprise/entities/dish-ingredient-list'
import { DishAttachment } from '../../enterprise/entities/dish-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface EditDishUseCaseRequest {
  dishId: string
  categoryId: string
  name: string
  description: string
  price: number
  ingredients: string[]
  attachmentsIds: string[]
}

type EditDishUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dish: Dish
  }
>

@Injectable()
export class EditDishUseCase {
  constructor(
    private dishRepository: DishRepository,
    private dishAttachmentsRepository: DishAttachmentsRepository,
    private dishIngredientsRepository: DishIngredientsRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    dishId,
    description,
    name,
    price,
    categoryId,
    attachmentsIds,
    ingredients,
  }: EditDishUseCaseRequest): Promise<EditDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    const currentDishAttachments =
      await this.dishAttachmentsRepository.findManyByDishId(dishId)
    const currentDishIngredients =
      await this.dishIngredientsRepository.findManyByDishId(dishId)

    const dishAttachmentsList = new DishAttachmentList(currentDishAttachments)
    const dishIngredientsList = new DishIngredientList(currentDishIngredients)

    const dishAttachments = attachmentsIds.map((attachmentId) => {
      return DishAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        dishId: dish.id,
      })
    })
    const dishIngredient = ingredients.map((ingredient) => {
      return DishIngredient.create({
        ingredientName: ingredient,
        dishId: dish.id,
      })
    })

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    dishAttachmentsList.update(dishAttachments)
    dishIngredientsList.update(dishIngredient)

    dish.name = name
    dish.price = price
    dish.description = description
    dish.categoryId = category.id

    dish.attachments = dishAttachmentsList
    dish.ingredients = dishIngredientsList

    await this.dishRepository.save(dish)

    return right({
      dish,
    })
  }
}
