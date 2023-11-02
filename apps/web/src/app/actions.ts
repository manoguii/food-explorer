'use server'

import { revalidateTag } from 'next/cache'
import { auth, signIn, signOut } from '../auth'

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

  revalidateTag('Categories')

  return {
    success: true,
    message: `A categoria ${category} foi criada com sucesso.`,
  }
}
