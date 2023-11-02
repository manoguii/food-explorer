'use server'

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
