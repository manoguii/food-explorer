import { SidebarNavItem } from '@/lib/types/definitions'

interface RoutesConfig {
  mainNav: {
    title: string
    href: string
  }[]
  dashboardNav: SidebarNavItem[]
}

export const routesConfig: RoutesConfig = {
  mainNav: [
    {
      title: 'Meus favoritos',
      href: '/food/favorites',
    },
    {
      title: 'Histórico de pedidos',
      href: '/food/orders',
    },
  ],
  dashboardNav: [
    {
      title: 'Pratos',
      href: '/dashboard',
      icon: 'dishes',
    },
    {
      title: 'Pedidos',
      href: '/dashboard/orders',
      icon: 'orders',
    },
    {
      title: 'Categorias',
      href: '/dashboard/categories',
      icon: 'categories',
    },
  ],
}
