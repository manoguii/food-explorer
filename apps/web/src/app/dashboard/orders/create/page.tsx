import { OrderItems } from '@/app/dashboard/orders/create/order-items'
import { PaymentMethod } from '@/app/dashboard/orders/create/payment-method'

export default async function CreateOrder() {
  return (
    <div className="grid gap-8 min-[900px]:grid-cols-2">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Meu pedido</h2>
        <div className="space-y-4">
          <OrderItems />
        </div>
      </div>

      <div className="max-w-xl space-y-6">
        <h2 className="text-2xl font-semibold">Pagamento</h2>
        <PaymentMethod />
      </div>
    </div>
  )
}
