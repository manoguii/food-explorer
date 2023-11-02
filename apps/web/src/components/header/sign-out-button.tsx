'use client'

import { LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { logout } from '@/app/actions'

export function SignOutButton() {
  return (
    <Button variant="ghost" size="icon" onClick={async () => await logout()}>
      <LogOut className="h-6 w-6" />
    </Button>
  )
}
