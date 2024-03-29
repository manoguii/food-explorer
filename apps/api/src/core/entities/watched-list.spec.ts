import { WatchedList } from '@/core/entities/watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

class ItemsWatchedList extends WatchedList<{
  dishId: string
  quantity: number
}> {
  compareItems(
    a: { dishId: string; quantity: number },
    b: { dishId: string; quantity: number },
  ): boolean {
    return a.dishId === b.dishId && a.quantity === b.quantity
  }
}

describe('watched list', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)

    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)

    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })

  it('should return true when the item exists in the current list', () => {
    const item1 = { id: 1, name: 'John' }
    const item2 = { id: 2, name: 'Jane' }
    const list = new NumberWatchedList([item1.id, item2.id])

    expect(list.exists(item1.id)).toBe(true)
    expect(list.exists(item2.id)).toBe(true)
  })

  it('test list', () => {
    const receivedItems = [
      { dishId: 'id-1', quantity: 3 },
      { dishId: 'id-2', quantity: 2 },
      { dishId: 'id-3', quantity: 1 },
    ]

    const currentItems = [
      { dishId: 'id-1', quantity: 1 },
      { dishId: 'id-2', quantity: 2 },
    ]

    const list = new ItemsWatchedList(currentItems)

    list.update(receivedItems)

    expect(list.currentItems).toHaveLength(3)
    expect(list.currentItems).toEqual(receivedItems)
  })
})
