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
import { useRouter } from 'next/navigation'
import { CreateAccountFormValues, createAccountFormSchema } from '@/lib/schemas'

const defaultValues: Partial<CreateAccountFormValues> = {
  name: '',
  email: '',
  password: '',
}

export function CreateAccountForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues,
  })

  const router = useRouter()

  async function onSubmit(userInfo: CreateAccountFormValues) {
    setIsLoading(true)

    const response = await fetch('http://localhost:3333/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    })

    if (!response.ok) {
      const result = await response.json()

      const errorMessage = result.message || 'Tente novamente mais tarde.'

      toast({
        title: 'Error ao criar conta.',
        description: errorMessage,
        variant: 'destructive',
      })

      setIsLoading(false)

      return
    }

    router.replace('/auth/sign-in')

    toast({
      title: 'Conta criada com sucesso.',
      description: 'Faça login para continuar.',
    })

    setIsLoading(false)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button disabled={isLoading} variant={'destructive'}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Criar conta
          </Button>

          <Link
            href="/auth/sign-in"
            className={cn(buttonVariants({ variant: 'ghost' }))}
          >
            Ja tenho uma conta
          </Link>
        </form>
      </Form>
    </div>
  )
}
