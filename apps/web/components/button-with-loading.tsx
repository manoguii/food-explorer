import { RotateCw } from 'lucide-react'

import { Icons } from './icons'
import { Button, ButtonProps } from './ui/button'

interface ButtonWithLoadingProps extends ButtonProps {
  isLoading: boolean
  icon?: keyof typeof Icons
  children: React.ReactNode
}

export function ButtonWithLoading({
  isLoading,
  icon,
  children,
  ...props
}: ButtonWithLoadingProps) {
  const Icon = icon ? Icons[icon] : null
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="mr-2 h-4 w-4" />
      )}
      {children}
    </Button>
  )
}
