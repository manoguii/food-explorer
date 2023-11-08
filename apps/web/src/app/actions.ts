'use server'

import { revalidateTag } from 'next/cache'
import { auth, signIn, signOut } from '../auth'

type UploadFileResponse =
  | {
      success: true
      message: string
      attachmentId: string
    }
  | {
      success: false
      message: string
    }

interface CreateDishType {
  name: string
  description: string
  price: number
  ingredients: string[]
  categoryId: string
  attachmentsIds: string[]
}

interface UpdateDishType {
  id: string
  name: string
  description: string
  slug: string
  price: number
  ingredients: string[]
  categoryId: string
  attachmentsIds: string[]
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
  const session = await auth()

  if (!session) {
    return {
      success: false,
      message: 'Você precisa estar logado para criar uma categoria.',
    }
  }

  const token = session.user.access_token

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

export async function createDish(dish: CreateDishType) {
  const session = await auth()

  if (!session) {
    return {
      success: false,
      message: 'Você precisa estar logado para criar um prato.',
    }
  }

  const token = session.user.access_token

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

export async function updateDish(dish: UpdateDishType) {
  const session = await auth()

  if (!session) {
    return {
      success: false,
      message: 'Você precisa estar logado para atualizar um prato.',
    }
  }

  const token = session.user.access_token

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
  const session = await auth()

  if (!session) {
    return {
      success: false,
      message: 'Você precisa estar logado para criar um arquivo.',
    }
  }

  const token = session.user.access_token

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
