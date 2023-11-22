import { AddToCart } from '@/components/buttons/add-to-cart'
import Price from '@/components/price'
import { Badge } from '@/components/ui/badge'
import { Dish } from '@/lib/types/definitions'

export function DishDescription({ dish }: { dish: Dish }) {
  return (
    <>
      <div className="mb-6 flex flex-col pb-6">
        <h1 className="mb-2 text-4xl font-medium">{dish.name}</h1>
        <div className="mr-auto w-auto rounded-lg bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={dish.price.toString()}
            currencyCode={'BRL'}
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {dish.ingredients.map((item) => {
          return (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          )
        })}
      </div>

      <p className="mb-6 text-sm leading-tight dark:text-white/[60%]">
        {dish.description}
      </p>

      <AddToCart dish={dish} />
    </>
  )
}
