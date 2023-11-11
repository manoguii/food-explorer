import { OrderCard } from '@/components/cards'
import { PaymentMethod } from '@/components/payment-method'

export default async function CreateOrder() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Meu pedido</h2>
        <div className="space-y-4">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>

      <div className="max-w-lg space-y-6">
        <h2 className="text-2xl font-semibold">Pagamento</h2>
        <PaymentMethod />
      </div>
    </div>
  )
}
