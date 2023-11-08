'use client'

import { Navigation, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Card } from './cards'
import { Dish } from '@/lib/types/definitions'
import 'swiper/css'
import 'swiper/css/navigation'

interface DishSlidesProps {
  dishes: Dish[]
}

export function DishSlides({ dishes }: DishSlidesProps) {
  return (
    <Swiper
      modules={[Navigation, A11y]}
      spaceBetween={28}
      slidesPerView={'auto'}
      centeredSlides={true}
      centerInsufficientSlides={true}
      centeredSlidesBounds={true}
      navigation
      breakpoints={{
        600: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        840: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        1120: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
      }}
    >
      {dishes.map((item) => (
        <SwiperSlide key={item.name}>
          <Card href={`/dashboard/dish/${item.slug}`} dish={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
