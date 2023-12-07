import { Layout } from '@/components/layout'
import { FoodDataTableSkeleton } from '@/components/skeletons'

export default function OrdersLoading() {
  return (
    <Layout>
      <Layout.Title>Pedidos</Layout.Title>

      <FoodDataTableSkeleton />
    </Layout>
  )
}
