'use server'

import {
  CreateDishParams,
  UpdateDishParams,
  UploadFileResponse,
} from '@/lib/types/definitions'
import { fetchWithToken } from '@/lib/utils'

import { signIn, signOut } from '../auth'

export async function authenticate(user: { email: string; password: string }) {
  try {
    await signIn('credentials', user)
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialSignin'
    }
    throw error
  }
}

export async function logout() {
  await signOut()
}

export async function createCategory(category: string) {
  const response = await fetchWithToken('http://localhost:3333/categories', {
    method: 'POST',
    body: JSON.stringify({ name: category }),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  return {
    success: true,
    message: `A categoria ${category} foi criada com sucesso.`,
  }
}

export async function createDish(dish: CreateDishParams) {
  const response = await fetchWithToken('http://localhost:3333/dishes', {
    method: 'POST',
    body: JSON.stringify(dish),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  return {
    success: true,
    message: `O prato ${dish.name} foi criado com sucesso.`,
  }
}

export async function updateDish(dish: UpdateDishParams) {
  const response = await fetchWithToken(
    `http://localhost:3333/dishes/${dish.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(dish),
    },
  )

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  return {
    success: true,
    message: `O prato ${dish.name} foi atualizado com sucesso.`,
  }
}

export async function uploadFile(
  formData: FormData,
): Promise<UploadFileResponse> {
  const response = await fetchWithToken('http://localhost:3333/attachments', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  const attachmentId = data.attachmentId as string

  return {
    success: true,
    message: `Arquivo criado com sucesso.`,
    attachmentId,
  }
}

export async function toggleFavoriteDish(dishId: string, isFavorite: boolean) {
  let successMessage: string
  let method: 'PATCH' | 'DELETE'

  if (isFavorite) {
    successMessage = 'Prato removido dos favoritos com sucesso.'
    method = 'DELETE'
  } else {
    successMessage = 'Prato adicionado aos favoritos com sucesso.'
    method = 'PATCH'
  }

  const response = await fetchWithToken(
    `http://localhost:3333/dishes/${dishId}/favorite`,
    {
      method,
    },
  )

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  return {
    success: true,
    message: successMessage,
  }
}

export async function createOrder(
  items: {
    dishId: string
    quantity: number
  }[],
) {
  const response = await fetchWithToken(`http://localhost:3333/orders`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  return {
    success: true,
    message: `Pedido criado com sucesso !`,
  }
}
