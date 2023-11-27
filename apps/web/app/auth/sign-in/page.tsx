import { Metadata } from "next"

import { UserAuthForm } from "../../../components/forms/user-auth-form"

export const metadata: Metadata = {
  title: "Login",
  description:
    "Faça login para acessar sua conta no Food Explorer e acessar todos os recursos.",
}

export default function SignIn() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Fazer login</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email e senha ou faça login com uma rede social.
          </p>
        </div>

        <UserAuthForm />
      </div>
    </div>
  )
}
