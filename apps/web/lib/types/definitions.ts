import { Icons } from '@/components/icons'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
export type Label = 'TABLE' | 'DELIVERY' | 'TAKEOUT'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

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

export type Order = {
  id: string
  status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
  code: string
  createdAt: string
  updatedAt: string
  dishes: {
    id: string
    name: string
    description: string
    price: number
    slug: string
    attachments: {
      id: string
      title: string
      url: string
    }[]
    quantity: number
    status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
  }[]

  client: {
    id: string
    name: string
    email: string
  }
}

export type Dish = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  attachments: {
    title: string
    url: string
    id: string
  }[]
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

export type FetchOrdersResponse = {
  orders: {
    id: string
    details: string
    code: string
    status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
    label: 'TABLE' | 'DELIVERY' | 'TAKEOUT'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    createdAt: string
    updatedAt: string | null
  }[]
  totalPages: number
}

export type FetchFavoriteDishesResponse = {
  favoriteDishes: Dish[]
  totalPages: number
}

export type FetchCategoriesResponse = {
  categories: Category[]
  totalPages: number
}

export type FetchDishesResponse = {
  dishes: Dish[]
  totalPages: number
}

export type GetOrderByIdResponse = {
  order: Order
}

export type GetUserSessionResponse = {
  user: User
}

export type GetDishBySlugResponse = {
  dish: Dish
}

export type UploadFileResponse = {
  attachmentId: string
}

export interface CartItem extends Dish {
  quantity?: number
}

export type SidebarNavItem = {
  title: string
  href: string
  icon?: keyof typeof Icons
}
