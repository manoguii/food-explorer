import { BadgePlus, ChefHat, ListOrdered, Star } from 'lucide-react'

export const routesConfig = {
  mainNav: [
    {
      title: 'Favoritos',
      href: '/food/favorites',
    },
    {
      title: 'Histórico',
      href: '/food/orders',
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
