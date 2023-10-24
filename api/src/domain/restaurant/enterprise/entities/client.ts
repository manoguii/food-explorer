import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FavoriteDish } from './favorite-dish'

export interface ClientProps {
  name: string
  email: string
  password: string

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

  get favoriteDishes() {
    return this.props.favoriteDishes
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id)

    return client
  }
}
