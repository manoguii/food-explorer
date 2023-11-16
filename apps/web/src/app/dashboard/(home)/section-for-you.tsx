'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import Image from 'next/image'

export function SectionForYou() {
  return (
    <Swiper
      slidesPerView={'auto'}
      centeredSlides={true}
      centerInsufficientSlides={true}
      centeredSlidesBounds={true}
      breakpoints={{
        640: {
          width: 640,
          slidesPerView: 1,
        },
        768: {
          width: 768,
          slidesPerView: 2,
        },
      }}
      spaceBetween={16}
      navigation={true}
      modules={[Navigation]}
    >
      <SwiperSlide>
        <Image
          width={450}
          height={250}
          className="mx-auto aspect-video rounded-lg object-cover"
          quality={100}
          src={'/images/slide-01.jpg'}
          alt="slide_image"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          width={450}
          height={250}
          className="mx-auto aspect-video rounded-lg object-cover"
          quality={100}
          src={'/images/slide-02.png'}
          alt="slide_image"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          width={450}
          height={250}
          className="mx-auto aspect-video rounded-lg object-cover"
          quality={100}
          src={'/images/slide-03.png'}
          alt="slide_image"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          width={450}
          height={250}
          className="mx-auto aspect-video rounded-lg object-cover"
          quality={100}
          src={'/images/slide-04.png'}
          alt="slide_image"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          width={450}
          height={250}
          className="mx-auto aspect-video rounded-lg object-cover"
          quality={100}
          src={'/images/slide-05.png'}
          alt="slide_image"
        />
      </SwiperSlide>
    </Swiper>
  )
}
