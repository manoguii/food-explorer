import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MinusIcon, Plus } from 'lucide-react'

export default function Dish({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-1 lg:max-w-5xl lg:grid-cols-2 lg:gap-x-20">
        <div className="relative col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 p-3 sm:row-start-2 sm:bg-none sm:p-0 lg:row-start-1">
          <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 dark:sm:text-white md:text-2xl">
            Beach House in Collingwood
          </h1>
          <p className="text-sm font-medium leading-4 text-white sm:text-slate-500 dark:sm:text-slate-400">
            Entire house
          </p>
        </div>
        <div className="col-start-1 col-end-3 row-start-1 grid gap-4 sm:mb-6 sm:grid-cols-4 lg:col-start-2 lg:row-span-6 lg:row-end-6 lg:mb-0 lg:gap-6">
          <img
            src="/beach-house.jpg"
            alt=""
            className="h-60 w-full rounded-lg object-cover sm:col-span-2 sm:h-52 lg:col-span-full"
            loading="lazy"
          />
          <img
            src="/beach-house-interior-1.jpg"
            alt=""
            className="hidden h-52 w-full rounded-lg object-cover sm:col-span-2 sm:block md:col-span-1 lg:col-span-2 lg:row-start-2 lg:h-32"
            loading="lazy"
          />
          <img
            src="/beach-house-interior-2.jpg"
            alt=""
            className="hidden h-52 w-full rounded-lg object-cover md:block lg:col-span-2 lg:row-start-2 lg:h-32"
            loading="lazy"
          />
        </div>
        <dl className="row-start-2 mt-4 flex items-center text-xs font-medium sm:row-start-3 sm:mt-1 md:mt-2.5 lg:row-start-2">
          <dt className="sr-only">Reviews</dt>
          <dd className="flex items-center text-indigo-600 dark:text-indigo-400">
            <button>
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="mr-1 stroke-current dark:stroke-indigo-500"
              >
                <path
                  d="m12 5 2 5h5l-4 4 2.103 5L12 16l-5.103 3L9 14l-4-4h5l2-5Z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <span>
              4.89 <span className="font-normal text-slate-400">(128)</span>
            </span>
          </dd>
          <dt className="sr-only">Location</dt>
          <dd className="flex items-center">
            <svg
              width="2"
              height="2"
              aria-hidden="true"
              fill="currentColor"
              className="mx-3 text-slate-300"
            >
              <circle cx="1" cy="1" r="1" />
            </svg>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mr-1 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            >
              <path d="M18 11.034C18 14.897 12 19 12 19s-6-4.103-6-7.966C6 7.655 8.819 5 12 5s6 2.655 6 6.034Z" />
              <path d="M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
            </svg>
            Bebidas
          </dd>
        </dl>
        <div className="col-start-1 row-start-3 mt-4 self-center sm:col-start-2 sm:row-span-2 sm:row-start-2 sm:mt-0 lg:col-start-1 lg:row-start-3 lg:row-end-4 lg:mt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost">
                <MinusIcon />
              </Button>
              <span>01</span>
              <Button size="icon" variant="ghost">
                <Plus />
              </Button>
            </div>

            <Button variant="destructive">Adicionar</Button>
          </div>
        </div>
        <div className="col-start-1 mt-4 sm:col-span-2 lg:col-span-1 lg:row-start-4 lg:mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 912, 12, 14, 15, 122, 344, 555].map(
              (item) => {
                return (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                )
              },
            )}
          </div>

          <p className="text-sm leading-6 dark:text-slate-400">
            This sunny and spacious room is for those traveling light and
            looking for a comfy and cosy place to lay their head for a night or
            two. This beach house sits in a vibrant neighborhood littered with
            cafes, pubs, restaurants and supermarkets and is close to all the
            major attractions such as Edinburgh Castle and Arthurs Seat.
          </p>
        </div>
      </div>
    </>
  )
}
