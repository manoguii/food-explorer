'use client'

import { RotateCw } from 'lucide-react'
import React from 'react'

import { logout } from '@/db/actions'

import { DropdownMenuItem } from './ui/dropdown-menu'

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false)

  async function handleLogout() {
    setLoading(true)
    await logout()
    setLoading(false)
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      {loading ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : null}
      Sair
    </DropdownMenuItem>
  )
}
