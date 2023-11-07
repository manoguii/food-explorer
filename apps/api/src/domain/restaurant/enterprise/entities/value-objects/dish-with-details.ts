import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface DishWithDetailsProps {
  dishId: UniqueEntityID
  name: string
  description: string
  price: number
  slug: string
  category: string
  ingredients: string[]
  attachments: {
    id: string
    title: string
    url: string
  }[]
  createdAt: Date
  updatedAt?: Date | null
}

export class DishWithDetails extends ValueObject<DishWithDetailsProps> {
  get dishId() {
    return this.props.dishId
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get price() {
    return this.props.price
  }

  get slug() {
    return this.props.slug
  }

  get category() {
    return this.props.category
  }

  get ingredients() {
    return this.props.ingredients
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public static create(props: DishWithDetailsProps) {
    return new DishWithDetails(props)
  }
}
