'use server'

import {
  CreateDishParams,
  UpdateDishParams,
  UploadFileResponse,
} from '@/lib/types/definitions'
import { revalidateTag } from 'next/cache'
import { auth, signIn, signOut } from '../auth'
import { redirect } from 'next/navigation'

export async function getAuthToken() {
  const session = await auth()

  if (!session) return redirect('/auth/sign-in')

  const token = session.user.access_token

  return token
}

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
  const token = await getAuthToken()

  const response = await fetch('http://localhost:3333/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: category }),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  revalidateTag('categories-tag')

  return {
    success: true,
    message: `A categoria ${category} foi criada com sucesso.`,
  }
}

export async function createDish(dish: CreateDishParams) {
  const token = await getAuthToken()

  const response = await fetch('http://localhost:3333/dishes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dish),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  revalidateTag('featured-dishes')

  return {
    success: true,
    message: `O prato ${dish.name} foi criado com sucesso.`,
  }
}

export async function updateDish(dish: UpdateDishParams) {
  const token = await getAuthToken()

  const response = await fetch(`http://localhost:3333/dishes/${dish.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dish),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  revalidateTag('featured-dishes')
  revalidateTag(`dish-${dish.slug}`)

  return {
    success: true,
    message: `O prato ${dish.name} foi atualizado com sucesso.`,
  }
}

export async function uploadFile(
  formData: FormData,
): Promise<UploadFileResponse> {
  const token = await getAuthToken()

  const response = await fetch('http://localhost:3333/attachments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export async function addFavoriteDish(dishId: string) {
  const token = await getAuthToken()

  const response = await fetch(
    `http://localhost:3333/dishes/${dishId}/favorite`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const data = await response.json()
    return {
      success: false,
      message: data.message as string,
    }
  }

  revalidateTag('favorite-dishes')

  return {
    success: true,
    message: `Prato adicionado aos favoritos com sucesso.`,
  }
}
