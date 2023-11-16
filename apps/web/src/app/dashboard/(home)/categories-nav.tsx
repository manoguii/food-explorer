'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type CategoriesNavProps = React.HTMLAttributes<HTMLDivElement> & {
  categories: {
    id: string
    name: string
  }[]
}

export function CategoriesNav({
  categories,
  className,
  ...props
}: CategoriesNavProps) {
  const pathname = usePathname()

  const categoriesWithHref = categories.map((category) => ({
    ...category,
    href: `/dashboard/${category.name.toLowerCase()}`,
  }))

  return (
    <ScrollArea className="max-w-[600px] lg:max-w-none">
      <div className={cn('my-2 -ml-4 flex items-center', className)} {...props}>
        {categoriesWithHref.map((category) => (
          <Link
            href={category.href}
            key={category.id}
            className={cn(
              'flex items-center px-4',
              decodeURIComponent(pathname)?.startsWith(category.href)
                ? 'font-bold text-primary'
                : 'font-medium text-muted-foreground',
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}
