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
    return 'Você precisa estar logado para criar uma categoria.'
  }

  const token = session.user.access_token

  await fetch('http://localhost:3333/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: category }),
  })

  revalidateTag('Categories')
}
