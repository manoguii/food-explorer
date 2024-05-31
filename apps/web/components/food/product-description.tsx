import Price from '@/components/food/price'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { DishWithDetails } from '@/lib/types/definitions'
import { cn } from '@/lib/utils'

import { AddToCart } from '../cart/add-to-cart'

export function DishDescription({ dish }: { dish: DishWithDetails }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-medium text-primary sm:text-4xl">
          {dish.name}
        </h1>
        <div
          className={cn(
            badgeVariants({
              variant: 'default',
            }),
            'rounded-md px-2 py-1 text-base sm:px-3 sm:py-2',
          )}
        >
          <Price
            amount={dish.price.toString()}
            currencyCode="BRL"
            className="text-sm sm:text-base"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {dish.ingredients.map((item) => {
          return (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          )
        })}
      </div>

      <p className="leading-tight text-muted-foreground">{dish.description}</p>

      <AddToCart dish={dish} />
    </div>
  )
}
