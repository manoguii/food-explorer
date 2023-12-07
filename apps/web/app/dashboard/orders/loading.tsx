import { Layout } from '@/components/layout'

export default function OrdersLoading() {
  return (
    <Layout>
      <Layout.Header
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <div className="divide-border-200 divide-y rounded-md border">
        <p>Carregando pedidos...</p>
      </div>
    </Layout>
  )
}
