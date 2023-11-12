import { create } from 'zustand'
import { Dish } from '../types/definitions'

export interface CartItem extends Dish {
  count: number
}

type CartStore = {
  cart: CartItem[]
  count: () => number
  countItem: (dishId: string) => number
  add: (dish: Dish) => void
  remove: (dishId: string) => void
  increment: (dishId: string) => void
  decrement: (dishId: string) => void
  getTotal: () => number
  removeAll: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  count: () => {
    const { cart } = get()
    if (cart.length)
      return cart.map((item) => item.count).reduce((prev, curr) => prev + curr)
    return 0
  },
  countItem: (dishId: string) => {
    const { cart } = get()
    const item = cart.find((item) => item.id === dishId)
    if (item && cart.length)
      return [item]
        .map((item) => item.count)
        .reduce((prev, curr) => prev + curr)
    return 0
  },
  add: (dish: Dish) => {
    const { cart } = get()
    const updatedCart = updateCart(dish, cart)
    set({ cart: updatedCart })
  },
  increment: (dishId: string) => {
    const { cart } = get()
    const updatedCart = incrementItem(dishId, cart)
    set({ cart: updatedCart })
  },
  decrement: (dishId: string) => {
    const { cart } = get()
    const updatedCart = decrementItem(dishId, cart)

    set({ cart: updatedCart })
  },
  remove: (dishId: string) => {
    const { cart } = get()
    const updatedCart = removeItem(dishId, cart)
    set({ cart: updatedCart })
  },
  getTotal: () => {
    const { cart } = get()
    if (cart.length)
      return cart
        .map((item) => item.price * item.count)
        .reduce((prev, curr) => prev + curr)
    return 0
  },
  removeAll: () => set({ cart: [] }),
}))

function updateCart(dish: Dish, cart: CartItem[]): CartItem[] {
  const cartItem = { ...dish, count: 1 } as CartItem

  const dishOnCart = cart.map((item) => item.id).includes(dish.id)

  if (!dishOnCart) cart.push(cartItem)
  else {
    return cart.map((item) => {
      if (item.id === dish.id)
        return { ...item, count: item.count + 1 } as CartItem
      return item
    })
  }

  return cart
}

function removeItem(dishId: string, cart: CartItem[]): CartItem[] {
  return cart.filter((item) => {
    return item.id !== dishId
  })
}

function decrementItem(dishId: string, cart: CartItem[]): CartItem[] {
  return cart
    .map((item) => {
      if (item.id === dishId) return { ...item, count: item.count - 1 }
      return item
    })
    .filter((item) => {
      return item.count
    })
}

function incrementItem(dishId: string, cart: CartItem[]): CartItem[] {
  return cart
    .map((item) => {
      if (item.id === dishId) return { ...item, count: item.count + 1 }
      return item
    })
    .filter((item) => {
      return item.count
    })
}
