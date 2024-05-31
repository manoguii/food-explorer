import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface IngredientProps {
  name: string
  createdAt: Date
}

export class Ingredient extends Entity<IngredientProps> {
  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<IngredientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const ingredient = new Ingredient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return ingredient
  }
}
