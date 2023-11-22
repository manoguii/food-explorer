import { BadgePlus, ChefHat, ListOrdered, Star } from 'lucide-react'

export const routesConfig = {
  mainNav: [
    {
      title: 'Meus favoritos',
      href: '/food/favorites',
    },
    {
      title: 'Histórico de pedidos',
      href: '/food/orders',
    },
    {
      title: 'Novo prato',
      href: '/food/dish/create',
    },
  ],
  sidebarNav: [
    {
      title: 'Menu',
      href: '/food',
      icon: ChefHat,
    },
    {
      title: 'Favoritos',
      href: '/food/favorites',
      icon: Star,
    },
    {
      title: 'Pedidos',
      href: '/food/orders',
      icon: ListOrdered,
    },
    {
      title: 'Novo prato',
      href: '/food/dish/create',
      icon: BadgePlus,
    },
  ],
}
