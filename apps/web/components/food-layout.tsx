import { cn } from '@/lib/utils'

export function FoodLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col gap-6">{children}</div>
}

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

FoodLayout.Title = function LayoutTitle({
  children,
  className,
  ...rest
}: TitleProps) {
  return (
    <h1 className={cn('text-2xl font-semibold', className)} {...rest}>
      {children}
    </h1>
  )
}
