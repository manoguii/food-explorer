import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DishIngredientProps {
  dishId: UniqueEntityID
  ingredientId: UniqueEntityID
}

export class DishIngredient extends Entity<DishIngredientProps> {
  get dishId() {
    return this.props.dishId
  }

  get ingredientId() {
    return this.props.ingredientId
  }

  static create(props: DishIngredientProps, id?: UniqueEntityID) {
    const dishIngredient = new DishIngredient(props, id)

    return dishIngredient
  }
}
