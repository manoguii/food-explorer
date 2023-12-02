import { Suspense } from 'react'
import Link from 'next/link'
import { ChefHatIcon, ListOrdered } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FeaturedCategoriesList } from '@/components/featured-categories-list'
import { FoodLayout } from '@/components/food-layout'
import { Icons } from '@/components/icons'
import { FeaturedCategoriesWrapper } from '@/components/skeletons'

import { HeroHeader, HeroHeaderDescription, HeroHeaderHeading } from './hero'

export default async function Home() {
  return (
    <FoodLayout>
      <div className="relative grid grid-cols-1 sm:grid-cols-[60%_1fr]">
        <HeroHeader>
          <HeroHeaderHeading>Food explorer</HeroHeaderHeading>
          <HeroHeaderDescription>
            Explore os pratos mais populares da sua região e faça seu pedido
            online ou venha nos visitar presencialmente.
          </HeroHeaderDescription>
          <span className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            <Icons.logo className="ml-1 h-4 w-4" />{' '}
            <Separator className="mx-2 h-4" orientation="vertical" />{' '}
            <span className="sm:hidden">
              O restaurante queridinho da galera.
            </span>
            <span className="hidden sm:inline">
              O restaurante queridinho da galera.
            </span>
          </span>
          <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
            <Link href="/food/search" className={cn(buttonVariants())}>
              <ChefHatIcon className="mr-2 h-4 w-4" />
              Ver menu
            </Link>
            <Link
              href="/food/orders"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                }),
              )}
            >
              <ListOrdered className="mr-2 h-4 w-4" />
              Meus pedidos
            </Link>
          </div>
        </HeroHeader>
      </div>

      <Suspense key={'hero'} fallback={<FeaturedCategoriesWrapper />}>
        <FeaturedCategoriesList />
      </Suspense>
    </FoodLayout>
  )
}
