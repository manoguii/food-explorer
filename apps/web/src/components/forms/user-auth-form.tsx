'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'
import { UserAuthFormValues, userAuthFormSchema } from '@/lib/schemas'
import { authenticate } from '@/app/actions'
import { ReloadIcon } from '@radix-ui/react-icons'

const defaultValues: Partial<UserAuthFormValues> = {
  email: '',
  password: '',
}

export function UserAuthForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<UserAuthFormValues>({
    resolver: zodResolver(userAuthFormSchema),
    defaultValues,
  })

  async function onSubmit(data: UserAuthFormValues) {
    setIsLoading(true)

    authenticate(data)

    toast({
      title: 'Seja Bem vindo!',
      description: 'Você está logado.',
    })

    return setIsLoading(false)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="No mínimo 6 caracteres"
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} variant="destructive">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </Button>

      <Link
        href="/auth/sign-up"
        className={cn(buttonVariants({ variant: 'ghost' }))}
      >
        Criar uma conta
      </Link>
    </div>
  )
}
