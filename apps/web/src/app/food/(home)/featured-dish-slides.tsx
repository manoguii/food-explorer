'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { FeaturedDishCard } from '@/components/cards/featured-dish-card'

import 'swiper/css'
import 'swiper/css/navigation'
import { Dish } from '@/lib/types/definitions'

interface DishWhitFavorite extends Dish {
  isFavorite: boolean
}

export function FeaturedDishes({ dishes }: { dishes: DishWhitFavorite[] }) {
  return (
    <Swiper
      breakpoints={{
        610: {
          width: 640,
          slidesPerView: 1,
        },
        868: {
          width: 768,
          slidesPerView: 2,
        },
        1164: {
          width: 1024,
          slidesPerView: 3,
        },
      }}
      slidesPerView={1}
      spaceBetween={16}
      navigation={true}
      modules={[Navigation]}
    >
      {dishes.map((dish) => (
        <SwiperSlide key={dish.id}>
          <FeaturedDishCard dish={dish} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
