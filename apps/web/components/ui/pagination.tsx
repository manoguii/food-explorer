import { ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  isDisabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) => {
  const handleClick = (event: React.MouseEvent) => {
    if (isDisabled) {
      event.preventDefault()
    }
  }

  return (
    <PaginationItem>
      <Link
        aria-current={isActive ? 'page' : undefined}
        prefetch={false}
        className={cn(
          buttonVariants({
            variant: isActive ? 'default' : 'outline',
            size,
          }),
          isDisabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={handleClick}
        {...props}
      />
    </PaginationItem>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  isDisabled?: boolean
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="icon"
    className={cn('', className)}
    {...props}
  >
    <ChevronsLeft className="h-4 w-4" />
    <span className="sr-only">Anterior</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  isDisabled?: boolean
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="icon"
    className={cn('', className)}
    {...props}
  >
    <span className="sr-only">Proximo</span>
    <ChevronsRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
