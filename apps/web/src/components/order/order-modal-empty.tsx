import Image from 'next/image'
import { SheetDescription, SheetTitle } from '../ui/sheet'

export function OrdersModalEmpty() {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center overflow-hidden text-center">
      <Image src="/images/empty-cart.png" width={260} height={220} alt="" />
      <SheetTitle>Seu carrinho está vazio</SheetTitle>
      <SheetDescription>
        Voce ainda não adicionou nenhum prato ao seu pedido.
      </SheetDescription>
    </div>
  )
}
