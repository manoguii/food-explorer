import { Icons } from './icons'

export function Footer() {
  return (
    <footer className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-3 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Icons.logo className="h-5 w-5" isFooter />
        <h1 className="text-sm font-bold text-[#71717a] sm:text-lg">
          Food Explorer
        </h1>
      </div>

      <p className="text-[8px] sm:text-xs">
        © 2023 - Todos os direitos reservados.
      </p>
    </footer>
  )
}
