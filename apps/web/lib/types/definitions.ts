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

export type FetchFavoriteDishesResponse = {
  favoriteDishes: DishWithDetails[]
  totalPages: number
}

export type FetchCategoriesResponse = {
  categories: Category[]
  totalPages: number
}

export type FetchOrdersResponse = {
  orders: OrderWithDetails[]
  totalPages: number
}

export type FetchDishesResponse = {
  dishes: DishWithDetails[]
  totalPages: number
}

export type GetUserSessionResponse = {
  user: User
}

export type GetDishBySlugResponse = {
  dish: DishWithDetails
}

export type GetOrderByIdResponse = {
  order: OrderWithDetails
}

export type MetricsResponse = {
  value: number
}

export type OverviewResponse = {
  name: string
  total: number
}

export type RecentSalesResponse = {
  client: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  total: number
}

export type GetDashboardMetricsResponse = {
  metrics: {
    sales: MetricsResponse
    totalRevenue: MetricsResponse
    activeClients: MetricsResponse
    recentSales: RecentSalesResponse[]
    overview: OverviewResponse[]
  }
}

export type UploadFileResponse = {
  attachmentId: string
}
