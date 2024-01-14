'use client'

import * as React from 'react'
import Link from 'next/link'
import { authenticate } from '@/db/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { AuthFormValues, userAuthFormSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

import { ButtonWithLoading } from '../buttons/button-with-loading'
import * as Field from './fields'

const defaultValues: Partial<AuthFormValues> = {
  email: '',
  password: '',
}

export function UserAuthForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(userAuthFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AuthFormValues) {
    try {
      const result = await authenticate(data)

      if (result?.includes('CredentialSignin')) {
        toast({
          title: 'Error ao fazer login.',
          description:
            'Não foi possível fazer login, tente novamente mais tarde.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Seja Bem vindo!',
          description: 'Você está logado.',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <Field.Email />
          <Field.Password />

          <ButtonWithLoading
            type="submit"
            variant="destructive"
            isLoading={form.formState.isSubmitting}
          >
            Entrar
          </ButtonWithLoading>
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

      <ButtonWithLoading
        type="button"
        variant="outline"
        icon="gitHub"
        isLoading={form.formState.isSubmitting}
      >
        GitHub
      </ButtonWithLoading>

      <Link
        href="/auth/sign-up"
        className={cn(buttonVariants({ variant: 'ghost' }))}
      >
        Criar uma conta
      </Link>
    </div>
  )
}
