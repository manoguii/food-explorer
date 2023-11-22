'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams)
  const { replace } = useRouter()

  return (
    <ScrollArea className="max-w-[600px] lg:max-w-none">
      <div className={cn('my-2 -ml-4 flex items-center', className)} {...props}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              params.set('category', category.name.toLocaleLowerCase())
              params.delete('query')
              replace(`${pathname}?${params.toString()}`, { scroll: false })
            }}
            className={cn(
              'flex items-center px-4',
              params.get('category') === category.name.toLocaleLowerCase()
                ? 'font-bold text-primary'
                : 'font-medium text-muted-foreground',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
