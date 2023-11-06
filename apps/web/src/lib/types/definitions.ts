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
  }[]
  ingredients: string[]
  category: string
  createdAt: Date
  updatedAt: Date
}
