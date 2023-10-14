import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  DishAttachment,
  DishAttachmentProps,
} from '@/domain/restaurant/enterprise/entities/dish-attachment'

export function makeDishAttachment(
  override: Partial<DishAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const dishAttachment = DishAttachment.create(
    {
      dishId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return dishAttachment
}
