"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"

import { createAccountFormSchema, CreateAccountFormValues } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

import * as Field from "./fields"

const defaultValues: Partial<CreateAccountFormValues> = {
  name: "",
  email: "",
  password: "",
}

export async function CreateAccountForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues,
  })

  const router = useRouter()

  async function onSubmit(userInfo: CreateAccountFormValues) {
    setIsLoading(true)

    const response = await fetch("http://localhost:3333/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })

    if (!response.ok) {
      const result = await response.json()

      const errorMessage = result.message || "Tente novamente mais tarde."

      toast({
        title: "Error ao criar conta.",
        description: errorMessage,
        variant: "destructive",
      })

      setIsLoading(false)

      return
    }

    router.replace("/auth/sign-in")

    toast({
      title: "Conta criada com sucesso.",
      description: "Faça login para continuar.",
    })

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Field.Name />
          <Field.Email />
          <Field.Password />

          <Button disabled={isLoading} variant={"destructive"}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>

          <Link
            href="/auth/sign-in"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Ja tenho uma conta
          </Link>
        </form>
      </Form>
    </div>
  )
}
