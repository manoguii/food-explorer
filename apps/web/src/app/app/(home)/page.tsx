import { SectionDishes } from '@/components/section-dishes'
import { Hero } from '@/components/hero'

export default function Home() {
  return (
    <>
      <Hero />

      <SectionDishes title="Sobremesas" />
      <SectionDishes title="Bebidas" />
      <SectionDishes title="Refeições" />
    </>
  )
}
