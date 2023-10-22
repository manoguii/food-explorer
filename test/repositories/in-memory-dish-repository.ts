import { PaginationParams } from '@/core/repositories/pagination-params'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'
import { InMemoryDishIngredientsRepository } from './in-memory-dish-ingredients-repository'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryCategoryRepository } from './in-memory-category-repository'

export class InMemoryDishRepository implements DishRepository {
  public items: Dish[] = []

  constructor(
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private dishIngredientsRepository: InMemoryDishIngredientsRepository,
    private categoriesRepository: InMemoryCategoryRepository,
  ) {}

  async findById(id: string) {
    const dish = this.items.find((item) => item.id.toString() === id)

    if (!dish) {
      return null
    }

    return dish
  }

  async findBySlug(slug: string) {
    const dish = this.items.find((item) => item.slug.value === slug)

    if (!dish) {
      return null
    }

    return dish
  }

  async findBySlugWithDetails(slug: string) {
    const dish = this.items.find((item) => item.slug.value === slug)

    if (!dish) {
      return null
    }

    const category = await this.categoriesRepository.findById(
      dish.categoryId.toString(),
    )

    if (!category) {
      throw new Error('A dish cannot be created without a category !')
    }

    const ingredients = await this.dishIngredientsRepository.findManyByDishId(
      dish.id.toString(),
    )

    return DishWithDetails.create({
      dishId: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      slug: dish.slug.value,
      category: category.name,
      ingredients: ingredients.map((ingredient) => ingredient.ingredientName),
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Dish[]> {
    const itemsPerPage = 20

    const dish = this.items
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)

    return dish
  }

  async create(dish: Dish) {
    this.items.push(dish)

    await Promise.all([
      this.dishAttachmentsRepository.createMany(dish.attachments.getItems()),
      this.dishIngredientsRepository.createMany(dish.ingredients.getItems()),
    ])
  }

  async save(dish: Dish) {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items[itemIndex] = dish

    await Promise.all([
      this.dishAttachmentsRepository.createMany(dish.attachments.getNewItems()),
      this.dishIngredientsRepository.createMany(dish.ingredients.getNewItems()),
      this.dishAttachmentsRepository.deleteMany(
        dish.attachments.getRemovedItems(),
      ),
      this.dishIngredientsRepository.deleteMany(
        dish.ingredients.getRemovedItems(),
      ),
    ])
  }

  async delete(dish: Dish) {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items.splice(itemIndex, 1)

    this.dishAttachmentsRepository.deleteManyByDishId(dish.id.toString())
    this.dishIngredientsRepository.deleteManyByDishId(dish.id.toString())
  }
}
