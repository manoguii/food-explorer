import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Breadcrumb {
  label: string
  href: string
  active?: boolean
}

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={'flex flex-wrap text-xl md:text-2xl'}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={cn('text-base text-zinc-800 dark:text-zinc-500', {
              'text-zinc-900 dark:text-zinc-100': breadcrumb.active,
            })}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
