import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  FavoriteDish,
  FavoriteDishProps,
} from '@/domain/restaurant/enterprise/entities/favorite-dish'

export function makeFavoriteDish(
  override: Partial<FavoriteDishProps> = {},
  id?: UniqueEntityID,
) {
  const favoriteDish = FavoriteDish.create(
    {
      dishId: new UniqueEntityID(),
      clientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return favoriteDish
}
