import Image from 'next/image'

export function Hero() {
  return (
    <div className="mt-24 flex rounded-lg bg-gradient-to-r from-gray-900 to-[#00131C]">
      <div className="flex basis-3/6 items-end">
        <Image
          src="/images/hero.png"
          alt="Ingredientes"
          width={632}
          height={406}
          objectFit="cover"
          quality={100}
          className="-ml-2 -mt-14 min-w-[151px] sm:-ml-6"
        />
      </div>

      <div className="flex basis-4/6 flex-col justify-center px-2 py-3">
        <h1 className="text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">
          Sabores inigualáveis
        </h1>
        <p className="text-xs sm:text-base">
          Sinta o cuidado do preparo com ingredientes selecionados.
        </p>
      </div>
    </div>
  )
}
