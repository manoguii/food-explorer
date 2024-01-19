import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'
import { makeDish } from './make-dish'
import { makeIngredient } from './make-ingredient'
import { makeAttachment } from './make-attachment'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeCategory } from './make-category'
import { makeDishAttachment } from './make-dish-attachment'
import { makeDishIngredient } from './make-dish-ingredient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishAttachment } from '@/domain/restaurant/enterprise/entities/dish-attachment'
import { Category } from '@/domain/restaurant/enterprise/entities/category'
import { Ingredient } from '@/domain/restaurant/enterprise/entities/ingredient'
import { Attachment } from '@/domain/restaurant/enterprise/entities/attachment'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

interface AbstractFactory {
  createCategory(): Category
  createDish(categoryId: UniqueEntityID): Dish
  createIngredient(): Ingredient
  createAttachment(): Attachment
  createDishAttachment(
    dishId: UniqueEntityID,
    attachmentId: UniqueEntityID,
  ): DishAttachment
  createDishIngredient(
    dishId: UniqueEntityID,
    ingredientName: string,
  ): DishIngredient
  createDishWithCategory(): {
    dish: Dish
    category: Category
  }
  createDishWithCategoryAndAttachments(): {
    dish: Dish
    category: Category
    attachments: Attachment[]
  }
  createCompletedDish(): {
    dish: Dish
    category: Category
    attachments: Attachment[]
    ingredients: Ingredient[]
  }
}

export class DishAbstractFactory implements AbstractFactory {
  constructor(
    private dishRepository: InMemoryDishRepository,
    private categoriesRepository: InMemoryCategoryRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private ingredientsRepository: InMemoryIngredientsRepository,
    private dishIngredientsRepository: InMemoryDishIngredientsRepository,
  ) {}

  createCategory() {
    const category = makeCategory()
    this.categoriesRepository.items.push(category)
    return category
  }

  createDish(categoryId: UniqueEntityID) {
    const dish = makeDish({ categoryId })
    this.dishRepository.items.push(dish)
    return dish
  }

  createIngredient() {
    const ingredient = makeIngredient()
    this.ingredientsRepository.items.push(ingredient)
    return ingredient
  }

  createAttachment() {
    const attachment = makeAttachment()
    this.attachmentsRepository.items.push(attachment)
    return attachment
  }

  createDishAttachment(dishId: UniqueEntityID, attachmentId: UniqueEntityID) {
    const dishAttachment = makeDishAttachment({ dishId, attachmentId })
    this.dishAttachmentsRepository.items.push(dishAttachment)
    return dishAttachment
  }

  createDishIngredient(dishId: UniqueEntityID, ingredientName: string) {
    const dishIngredient = makeDishIngredient({ dishId, ingredientName })
    this.dishIngredientsRepository.items.push(dishIngredient)
    return dishIngredient
  }

  createDishWithCategory() {
    const category = this.createCategory()
    const dish = this.createDish(category.id)
    return {
      dish,
      category,
    }
  }

  createDishWithCategoryAndAttachments() {
    const { dish, category } = this.createDishWithCategory()
    const attachment1 = this.createAttachment()
    const attachment2 = this.createAttachment()
    this.createDishAttachment(dish.id, attachment1.id)
    this.createDishAttachment(dish.id, attachment2.id)
    return {
      dish,
      category,
      attachments: [attachment1, attachment2],
    }
  }

  createCompletedDish() {
    const { dish, category, attachments } =
      this.createDishWithCategoryAndAttachments()
    const ingredient1 = this.createIngredient()
    const ingredient2 = this.createIngredient()
    this.createDishIngredient(dish.id, ingredient1.name)
    this.createDishIngredient(dish.id, ingredient2.name)
    return {
      dish,
      category,
      attachments,
      ingredients: [ingredient1, ingredient2],
    }
  }
}
