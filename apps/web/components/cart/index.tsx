import { cookies } from 'next/headers'

import { CartWithDetails } from '@/lib/types/definitions'

import { getCartById } from './actions'
import { CartModal } from './modal'

export async function Cart() {
  const cartId = cookies().get('cartId')?.value
  let cart: CartWithDetails | undefined

  if (cartId) {
    const existingCart = await getCartById(cartId)

    cart = existingCart as CartWithDetails
  }

  return <CartModal cart={cart} />
}
