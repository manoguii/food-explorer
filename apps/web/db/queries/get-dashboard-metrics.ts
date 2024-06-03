import { fetcher } from '../utils'

type MetricsResponse = {
  value: number
}

type OverviewResponse = {
  name: string
  total: number
}

type RecentSalesResponse = {
  client: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  total: number
}

type GetDashboardMetricsResponse = {
  metrics: {
    sales: MetricsResponse
    totalRevenue: MetricsResponse
    activeClients: MetricsResponse
    recentSales: RecentSalesResponse[]
    overview: OverviewResponse[]
  }
}

export async function getDashboardMetrics(
  startDate?: string,
  endDate?: string,
) {
  try {
    const params = `?startDate=${startDate}&endDate=${endDate}`
    const endpoint = `/metrics${startDate && endDate ? params : ''}`
    const { metrics } = await fetcher<GetDashboardMetricsResponse>(endpoint)

    return metrics
  } catch (error) {
    console.error(error)
    return null
  }
}
