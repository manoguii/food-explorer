export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
export type Label = 'TABLE' | 'DELIVERY' | 'TAKEOUT'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type PaymentStatus = 'PAID' | 'UNPAID'

export type User = {
  id: string
  name: string
  email: string
  access_token: string
}

export type Category = {
  id: string
  name: string
  createdAt: string
}

export type Cart = {
  cartId: string
  clientId: string
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export type Dish = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  ingredients: string[]
  attachments: {
    title: string
    url: string
    id: string
  }[]
}

export type CartItem = Dish & { quantity: number }

export interface OrderWithDetails {
  orderId: string
  clientId: string
  code: string
  currency: string
  amountTotal: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  priority: Priority
  label: Label
  createdAt: Date
  updatedAt?: Date | null

  cart: {
    totalAmount: number
    createdAt: Date
    updatedAt?: Date | null
    cartItems: CartItem[]
  }
}

export type CartWithDetails = Cart & {
  ingredients: string[]
  category: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string

  dishes: CartItem[]
  client: Omit<User, 'access_token'>
}

export type DishWithDetails = Dish & {
  ingredients: string[]
  category: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDishParams {
  name: string
  description: string
  price: number
  ingredients: string[]
  categoryId: string
  attachmentsIds: string[]
}

export interface UpdateDishParams {
  id: string
  name: string
  description: string
  slug: string
  price: number
  ingredients: string[]
  categoryId: string
  attachmentsIds: string[]
}
