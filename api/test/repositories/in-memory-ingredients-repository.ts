import { IngredientsRepository } from '@/domain/restaurant/application/repositories/ingredients-repository'
import { Ingredient } from '@/domain/restaurant/enterprise/entities/ingredient'

export class InMemoryIngredientsRepository implements IngredientsRepository {
  public items: Ingredient[] = []

  async create(ingredient: Ingredient): Promise<void> {
    this.items.push(ingredient)
  }
}
