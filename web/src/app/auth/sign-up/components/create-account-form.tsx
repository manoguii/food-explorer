'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function CreateAccountForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="name">
            Nome
          </Label>
          <Input
            id="name"
            placeholder="Maria da Silva"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="mariadasilva@mail.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="password">
            Email
          </Label>
          <Input
            id="password"
            placeholder="********"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
          />
        </div>

        <Button disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>

        <Link
          href="/auth/sign-in"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          Ja tenho uma conta
        </Link>
      </form>
    </div>
  )
}
