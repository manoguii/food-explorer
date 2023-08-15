import { Entity } from '../../core/entities/entity'

interface UserProps {
  name: string
  password: string
  role: 'user' | 'admin'
}

export class User extends Entity {
  public name: string
  public password: string
  public role: 'user' | 'admin'

  constructor(props: UserProps, id?: string) {
    super(id)

    this.name = props.name
    this.password = props.password
    this.role = props.role
  }
}
