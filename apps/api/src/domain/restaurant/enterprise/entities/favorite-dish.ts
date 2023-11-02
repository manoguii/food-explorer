import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface FavoriteDishProps {
  dishId: UniqueEntityID
  clientId: UniqueEntityID
}

export class FavoriteDish extends Entity<FavoriteDishProps> {
  get dishId() {
    return this.props.dishId
  }

  get clientId() {
    return this.props.clientId
  }

  static create(props: FavoriteDishProps, id?: UniqueEntityID) {
    const favoriteDish = new FavoriteDish(props, id)

    return favoriteDish
  }
}
