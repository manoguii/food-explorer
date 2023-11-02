'use client'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { productData, responsive } from '@/tmp/data'
import { Card } from './card'

interface SectionDishesProps {
  title: string
}

export function SectionDishes({ title }: SectionDishesProps) {
  return (
    <section className="space-y-5">
      <h4 className="text-3xl">{title}</h4>

      <Carousel showDots={false} responsive={responsive} sliderClass="gap-6">
        {productData.map((item) => (
          <Card key={item.id} href="/dish/1" />
        ))}
      </Carousel>
    </section>
  )
}
