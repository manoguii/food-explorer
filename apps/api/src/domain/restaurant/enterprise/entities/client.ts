import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FavoriteDish } from './favorite-dish'
import { Optional } from '@/core/types/optional'

export interface ClientProps {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'CLIENT' | 'MANAGER'

  favoriteDishes?: FavoriteDish[]
}

export class Client extends Entity<ClientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get favoriteDishes() {
    return this.props.favoriteDishes
  }

  static create(props: Optional<ClientProps, 'role'>, id?: UniqueEntityID) {
    const client = new Client(
      {
        ...props,
        role: props.role ?? 'CLIENT',
      },
      id,
    )

    return client
  }
}
