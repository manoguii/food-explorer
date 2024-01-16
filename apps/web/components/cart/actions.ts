'use server'

import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TAGS } from '@/db/constants'
import { fetcher } from '@/db/utils'

import { Cart, CartWithDetails } from '@/lib/types/definitions'

export async function createCart() {
  try {
    const endpoint = `/cart`

    const { cart } = await fetcher<{
      cart: Cart
    }>(endpoint, {
      method: 'POST',
    })

    return cart
  } catch (error) {
    console.error(error)

    throw {
      error,
    }
  }
}

export async function getCartById(cartId: string) {
  try {
    const endpoint = `/cart/${cartId}`
    const { cart } = await fetcher<{
      cart: CartWithDetails
    }>(endpoint, {
      next: {
        tags: [TAGS.cart],
      },
    })

    return cart
  } catch (error) {
    console.error(error)
    throw {
      error,
    }
  }
}

export async function finishOrder() {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) {
    return 'Cart id is missing'
  }

  let checkoutSessionUrl = ''

  try {
    const endpoint = `/checkout-session/${cartId}`

    const result = await fetcher<{ checkoutSessionUrl: string }>(endpoint, {
      method: 'POST',
    })

    checkoutSessionUrl = result.checkoutSessionUrl

    cookies().delete('cartId')
  } catch (error) {
    return 'Error adding item to cart'
  }

  redirect(checkoutSessionUrl)
}

export async function addItemToCart(
  prevState: unknown,
  item: {
    dishId: string
    quantity: number
  },
) {
  let cartId = cookies().get('cartId')?.value
  let cart

  if (cartId) {
    cart = await getCartById(cartId)
  }

  if (!cartId || !cart) {
    cart = await createCart()
    cartId = cart.cartId
    cookies().set('cartId', cartId)
  }

  try {
    const endpoint = `/cart/${cart.cartId}`
    await fetcher(endpoint, {
      method: 'POST',
      body: JSON.stringify(item),
    })
    revalidateTag(TAGS.cart)
  } catch (error) {
    console.error(error)
    return 'Error adding item to cart'
  }
}

export async function removeItem(prevState: unknown, dishId: string) {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) {
    return 'Missing cart ID'
  }

  try {
    const endpoint = `/cart/${cartId}`
    await fetcher(endpoint, {
      method: 'DELETE',
      body: JSON.stringify({ dishId }),
    })
    revalidateTag(TAGS.cart)
  } catch (e) {
    return 'Error removing item from cart'
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  item: {
    dishId: string
    quantity: number
  },
) {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) {
    return 'Missing cart ID'
  }

  const { dishId, quantity } = item

  const endpoint = `/cart/${cartId}`

  try {
    if (quantity === 0) {
      await fetcher(endpoint, {
        method: 'DELETE',
        body: JSON.stringify({ dishId }),
      })
      revalidateTag(TAGS.cart)
      return
    }

    await fetcher(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ item }),
    })
    revalidateTag(TAGS.cart)
  } catch (e) {
    return 'Error updating item quantity'
  }
}
