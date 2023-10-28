import { Icons } from './icons'

export function Footer() {
  return (
    <footer className="mt-12 flex items-center justify-between gap-8 bg-gray-50 px-4 py-4 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Icons.logo className="h-7 w-7" />
        <h1 className="text-lg font-bold">Food Explorer</h1>
      </div>

      <p className="text-sm"> © 2023 - Todos os direitos reservados.</p>
    </footer>
  )
}
