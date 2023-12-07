import { Layout } from '@/components/layout'
import { DataTableSkeleton } from '@/components/skeletons'

export default function OrdersLoading() {
  return (
    <Layout>
      <Layout.Header
        heading="Pedidos"
        text="Crie e gerencie os pedidos do restaurante."
      />

      <DataTableSkeleton />
    </Layout>
  )
}
