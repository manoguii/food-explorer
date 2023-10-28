'use client'

import { LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  async function handleSignOut() {
    await signOut({
      callbackUrl: '/',
    })
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleSignOut}>
      <LogOut className="h-6 w-6" />
    </Button>
  )
}
