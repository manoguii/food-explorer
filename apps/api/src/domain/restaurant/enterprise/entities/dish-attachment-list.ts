import { WatchedList } from '@/core/entities/watched-list'
import { DishAttachment } from './dish-attachment'

export class DishAttachmentList extends WatchedList<DishAttachment> {
  compareItems(a: DishAttachment, b: DishAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
