import { Icons } from './icons'

export function Footer() {
  return (
    <footer className="bg-gray-50 px-3 py-2 dark:bg-gray-900">
      <div className="mx-auto flex max-w-[1420px] items-center justify-between gap-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-1">
          <Icons.logo className="h-4 w-4" isFooter />
          <h1 className="text-xs font-bold text-[#71717a] sm:text-base">
            Food Explorer
          </h1>
        </div>

        <p className="text-[8px] text-muted-foreground sm:text-[10px]">
          © 2023 - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
