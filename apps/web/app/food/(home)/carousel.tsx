'use client'

import 'react-multi-carousel/lib/styles.css'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Carousel, { ResponsiveType } from 'react-multi-carousel'

import { DishWithDetails } from '@/lib/types/definitions'
import { Button } from '@/components/ui/button'
import { DishCard } from '@/components/cards'

export function CarouselList({
  dishes,
  category,
}: {
  dishes: DishWithDetails[]
  category?: string
}) {
  return (
    <div className="relative mx-auto flex flex-col-reverse">
      <Carousel
        itemClass="px-3"
        customButtonGroup={<ButtonGroup category={category || ''} />}
        arrows={false}
        renderButtonGroupOutside={true}
        additionalTransfrom={0}
        autoPlaySpeed={3000}
        centerMode={false}
        draggable={false}
        focusOnSelect={false}
        infinite={false}
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        slidesToSlide={1}
        swipeable
      >
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </Carousel>
    </div>
  )
}

function ButtonGroup({
  next,
  previous,
  category,
}: {
  next?: () => void
  previous?: () => void
  category: string
}) {
  return (
    <div className="mb-4 flex w-full items-start justify-between gap-2">
      <h1 className="text-2xl font-semibold leading-relaxed">{category}</h1>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => {
            if (previous) {
              previous()
            }
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => {
            if (next) {
              next()
            }
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

const responsive: ResponsiveType = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1124,
    },
    items: 4,
  },
  laptop: {
    breakpoint: {
      max: 1124,
      min: 868,
    },
    items: 3,
  },
  tablet: {
    breakpoint: {
      max: 868,
      min: 640,
    },
    items: 2,
  },
  mobile: {
    breakpoint: {
      max: 640,
      min: 0,
    },
    items: 1,
  },
}
