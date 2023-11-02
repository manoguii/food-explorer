import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DishIngredientProps {
  dishId: UniqueEntityID
  ingredientName: string
}

export class DishIngredient extends Entity<DishIngredientProps> {
  get dishId() {
    return this.props.dishId
  }

  get ingredientName() {
    return this.props.ingredientName
  }

  static create(props: DishIngredientProps, id?: UniqueEntityID) {
    const dishIngredient = new DishIngredient(props, id)

    return dishIngredient
  }
}
