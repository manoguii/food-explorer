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
  createdAt: Date
  updatedAt: Date
}

export type UploadFileResponse =
  | {
      success: true
      message: string
      attachmentId: string
    }
  | {
      success: false
      message: string
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

export interface CartItem extends Dish {
  quantity?: number
}
