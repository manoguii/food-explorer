import { WatchedList } from '@/core/entities/watched-list'
import { OrderItem } from './order-item'

export class OrderItemList extends WatchedList<OrderItem> {
  compareItems(a: OrderItem, b: OrderItem): boolean {
    return a.id.equals(b.id)
  }

  allItemsDelivered() {
    return this.currentItems.every((item) => item.isDelivered())
  }

  allItemsCanceled() {
    return this.currentItems.every((item) => item.isCanceled())
  }
}