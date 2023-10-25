import { Metadata } from 'next'
import { CreateAccountForm } from './components/create-account-form'

export const metadata: Metadata = {
  title: 'Criar conta',
  description:
    'Crie sua conta para ter acesso a todos os recursos do Food Explorer.',
}

export default function SignUp() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta para ter acesso a todos os recursos do Food Explorer.
          </p>
        </div>

        <CreateAccountForm />
      </div>
    </div>
  )
}
