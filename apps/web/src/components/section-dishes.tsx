'use client'

import { Navigation, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Card } from './card'

import 'swiper/css'
import 'swiper/css/navigation'
import { Dish } from '@/lib/types/definitions'

interface SectionDishesProps {
  title: string
  dishes: Dish[]
}

export function SectionDishes({ title, dishes }: SectionDishesProps) {
  return (
    <section className="space-y-5">
      <h4 className="text-3xl">{title}</h4>

      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={28}
        slidesPerView={4}
        navigation
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {dishes.map((item) => (
          <SwiperSlide key={item.name}>
            <Card href={`/app/dish/${item.slug}`} dish={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
