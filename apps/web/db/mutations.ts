'use server'

import { fetcher } from '@/db/utils'

import {
  CreateDishParams,
  Label,
  OrderStatus,
  Priority,
  UpdateDishParams,
  UploadFileResponse,
} from '@/lib/types/definitions'

export async function createCategory(category: string) {
  try {
    await fetcher('/categories', {
      method: 'POST',
      body: JSON.stringify({ name: category }),
    })
  } catch (error) {
    throw new Error('Error ao criar categoria.')
  }
}

export async function createDish(dish: CreateDishParams) {
  try {
    await fetcher('/dishes', {
      method: 'POST',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao criar prato.')
  }
}

export async function updateDish(dish: UpdateDishParams) {
  try {
    await fetcher(`/dishes/${dish.id}`, {
      method: 'PUT',
      body: JSON.stringify(dish),
    })
  } catch (error) {
    throw new Error('Error ao atualizar prato.')
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const result = await fetcher<UploadFileResponse>('/attachments', {
      method: 'POST',
      body: formData,
    })

    const attachmentId = result.attachmentId

    return attachmentId
  } catch (error) {
    throw new Error('Error ao fazer upload do arquivo.')
  }
}

export async function toggleFavoriteDish(dishId: string, isFavorite: boolean) {
  let errorMessage: string
  let method: 'PATCH' | 'DELETE'

  if (isFavorite) {
    errorMessage = 'Error ao remover prato dos favoritos.'
    method = 'DELETE'
  } else {
    errorMessage = 'Error ao favoritar prato.'
    method = 'PATCH'
  }

  try {
    await fetcher(`/dishes/${dishId}/favorite`, {
      method,
    })
  } catch (error) {
    throw new Error(errorMessage)
  }
}

export async function createOrder(
  items: {
    dishId: string
    quantity: number
  }[],
) {
  try {
    await fetcher(`/orders`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
  } catch (error) {
    throw new Error('Error ao criar pedido.')
  }
}

export async function updateDishStatus(
  orderId: string,
  data: {
    dishId: string
    status: OrderStatus
  },
) {
  try {
    await fetcher(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw new Error('Error ao atualizar status do pedido.')
  }
}

export async function updateOrder(
  orderId: string,
  data: {
    label?: Label
    priority?: Priority
  },
) {
  try {
    await fetcher(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw new Error('Error ao atualizar pedido.')
  }
}

export async function updateCategory(
  categoryId: string,
  data: {
    name: string
  },
) {
  try {
    await fetcher(`/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw new Error('Error ao atualizar categoria.')
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await fetcher(`/categories/${categoryId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover categoria.')
  }
}

export async function deleteDish(dishId: string) {
  try {
    await fetcher(`/dishes/${dishId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    throw new Error('Error ao remover prato.')
  }
}
