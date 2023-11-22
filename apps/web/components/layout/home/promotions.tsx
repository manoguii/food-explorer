import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const promotions = [
  { title: 'Restaurantes selecionados', image: '/images/slide-01.jpg' },
  { title: 'Sobremesas e bebidas', image: '/images/slide-02.png' },
  { title: 'Comida japonesa', image: '/images/slide-03.png' },
  { title: 'Comida mexicana', image: '/images/slide-04.png' },
  { title: 'Comida italiana', image: '/images/slide-05.png' },
]

export function PromotionsSection() {
  return (
    <ScrollArea className="h-48 whitespace-nowrap">
      <ul className="flex w-full gap-4">
        {promotions.map((promo, i) => (
          <li
            key={i}
            className="relative aspect-video h-[25vh] max-h-[190px] max-w-[400px]"
          >
            <Link href={`/`} className="relative h-full w-full">
              <PromotionImage
                alt={promo.title}
                quality={100}
                src={promo.image}
                fill
                label={{
                  title: promo.title,
                }}
              />
            </Link>
          </li>
        ))}
        <ScrollBar orientation="horizontal" />
      </ul>
    </ScrollArea>
  )
}

const Label = ({
  title,
  position = 'bottom',
}: {
  title: string
  position?: 'bottom' | 'center'
}) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4', {
        'lg:px-20 lg:pb-[35%]': position === 'center',
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
      </div>
    </div>
  )
}

function PromotionImage({
  active,
  label,
  ...props
}: {
  active?: boolean
  label?: {
    title: string
    position?: 'bottom' | 'center'
  }
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center !overflow-hidden rounded-lg border bg-white hover:border-gray-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-gray-600': active,
          'border-neutral-200 dark:border-neutral-800': !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className="relative h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
          {...props}
          alt=""
        />
      ) : null}
      {label ? <Label title={label.title} position={label.position} /> : null}
    </div>
  )
}
