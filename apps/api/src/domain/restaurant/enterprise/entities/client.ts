import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { FavoriteDish } from './favorite-dish'

export interface ClientProps {
  name: string
  email: string
  password: string
  image?: string | null
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

  get image() {
    return this.props.image
  }

  get role() {
    return this.props.role
  }

  get favoriteDishes() {
    return this.props.favoriteDishes
  }

  isAdmin() {
    return this.props.role === 'ADMIN'
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
