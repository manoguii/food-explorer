import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { fetchDishesByCategory } from "@/lib/data"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { getAuthToken } from "@/app/actions"

import { CarouselList } from "./carousel"
import { HeroHeader, HeroHeaderDescription, HeroHeaderHeading } from "./hero"

export default async function Home() {
  const token = await getAuthToken()
  const [{ dishes: salads }, { dishes: meals }, { dishes: desserts }] =
    await Promise.all([
      fetchDishesByCategory(token, "Saladas", 1),
      fetchDishesByCategory(token, "Refeições", 1),
      fetchDishesByCategory(token, "Sobremesas", 1),
    ])

  const dishes = [
    { dishes: desserts, category: "Sobremesas" },
    { dishes: salads, category: "Saladas" },
    { dishes: meals, category: "Refeições" },
  ]

  return (
    <div>
      <HeroHeader className="pb-4">
        <Link
          href="/food"
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
          <span className="sm:hidden">O restaurante queridinho da galera.</span>
          <span className="hidden sm:inline">
            O restaurante queridinho da galera.
          </span>
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
        <HeroHeaderHeading>Food explorer</HeroHeaderHeading>
        <HeroHeaderDescription>
          Explore os pratos mais populares da sua região e faça seu pedido
          online ou venha nos visitar presencialmente.
        </HeroHeaderDescription>
        <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
          <Link href="/food/search" className={cn(buttonVariants())}>
            Ver todos os pratos
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://github.com/manoguii/food-explorer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </div>
      </HeroHeader>

      <div className="space-y-14">
        {dishes.map(({ dishes, category }) => (
          <CarouselList key={category} dishes={dishes} category={category} />
        ))}
      </div>
    </div>
  )
}
