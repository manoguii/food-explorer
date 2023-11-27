import clsx from "clsx"
import { X } from "lucide-react"

import { useCartStore } from "@/lib/use-cart-store"

export function DeleteItemButton({ dishId }: { dishId: string }) {
  const { removeFromCart } = useCartStore()
  return (
    <button
      onClick={() => {
        removeFromCart(dishId)
      }}
      aria-label="Remove cart item"
      className={clsx(
        "ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 disabled:cursor-not-allowed"
      )}
    >
      <X className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  )
}
