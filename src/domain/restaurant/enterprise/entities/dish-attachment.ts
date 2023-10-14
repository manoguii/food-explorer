import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DishAttachmentProps {
  dishId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class DishAttachment extends Entity<DishAttachmentProps> {
  get dishId() {
    return this.props.dishId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: DishAttachmentProps, id?: UniqueEntityID) {
    const dishAttachment = new DishAttachment(props, id)

    return dishAttachment
  }
}
