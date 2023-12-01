import { Dish } from '@/lib/types/definitions'
import { Badge } from '@/components/ui/badge'
import { AddToCart } from '@/components/buttons/add-to-cart'
import Price from '@/components/price'

export function DishDescription({ dish }: { dish: Dish }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-2xl font-medium text-primary sm:text-4xl">
          {dish.name}
        </h1>
        <div className="w-auto rounded-lg bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={dish.price.toString()}
            currencyCode="BRL"
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
