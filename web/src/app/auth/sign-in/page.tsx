import { Metadata } from 'next'
import Link from 'next/link'
import { UserAuthForm } from './components/user-auth-form'

export const metadata: Metadata = {
  title: 'Autenticação',
  description: 'Autenticação de usuário para o Food Explorer.',
}

export default function SignIn() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Fazer login</h1>
          <p className="text-muted-foreground text-sm">
            Entre com seu email e senha ou faça login com uma rede social.
          </p>
        </div>

        <UserAuthForm />

        <p className="text-muted-foreground px-8 text-center text-sm">
          Ao clicar em continuar, você concorda com nossos{' '}
          <Link
            href="/"
            className="hover:text-primary underline underline-offset-4"
          >
            Termos de Serviço
          </Link>{' '}
          e{' '}
          <Link
            href="/"
            className="hover:text-primary underline underline-offset-4"
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
