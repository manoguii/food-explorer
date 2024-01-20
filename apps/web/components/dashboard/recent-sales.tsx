import { RecentSalesResponse } from '@/lib/types/definitions'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Price from '../food/price'

export function RecentSales({
  recentSales,
}: {
  recentSales: RecentSalesResponse[]
}) {
  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.client.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{getInitials(sale.client.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.client.name}
            </p>
            <p className="text-sm text-muted-foreground">{sale.client.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <Price amount={sale.total.toString()} currencyCode="BRL" />
          </div>
        </div>
      ))}
    </div>
  )
}
