import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'

interface DishWithAttachmentsProps {
  dishId: UniqueEntityID
  name: string
  description: string
  price: number
  slug: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class DishWithAttachments extends ValueObject<DishWithAttachmentsProps> {
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

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public static create(props: DishWithAttachmentsProps) {
    return new DishWithAttachments(props)
  }
}
