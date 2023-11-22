import { create } from 'zustand'
import { CartItem } from './types/definitions'

interface CartStore {
  cart: CartItem[]
  loading: boolean
  addToCart: (product: CartItem) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => void
  setCartItemQuantity: (productId: string, quantity: number) => void
  checkout: () => Promise<void>
  persistCart: () => void
  initializeCart: () => void
  getTotal: () => number
  changeDishQuantity: (productId: string, quantity: number) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  loading: false,

  addToCart: async (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id)

      if (existingItem) {
        // Se o produto já está no carrinho, incrementa a quantidade
        existingItem.quantity = (existingItem.quantity || 0) + 1
      } else {
        // Se o produto não está no carrinho, adiciona o novo produto
        state.cart = [...state.cart, { ...product, quantity: 1 }]
      }

      return {
        ...state,
        loading: true,
      }
    })

    // Simulação de operação assíncrona, por exemplo, uma requisição à API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    set((state) => {
      return {
        ...state,
        loading: false,
      }
    })

    get().persistCart()
  },

  removeFromCart: async (productId) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId)
      return {
        ...state,
        cart: updatedCart,
        loading: true,
      }
    })

    // Simulação de operação assíncrona
    await new Promise((resolve) => setTimeout(resolve, 1000))

    set((state) => {
      return {
        ...state,
        loading: false,
      }
    })

    get().persistCart()
  },

  clearCart: () => {
    set({ cart: [] })
    get().persistCart()
  },

  setCartItemQuantity: (productId, quantity) => {
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      )
      return {
        ...state,
        cart: updatedCart,
      }
    })

    get().persistCart()
  },

  checkout: async () => {
    set({ loading: true })

    // Simulação de operação assíncrona, como uma requisição à API de pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    set({ cart: [], loading: false })
    get().persistCart()
  },

  persistCart: () => {
    const { cart } = get()
    localStorage.setItem('cart', JSON.stringify(cart))
  },

  initializeCart: () => {
    const savedCart = localStorage.getItem('cart')
    set({ cart: savedCart ? JSON.parse(savedCart) : [] })
  },

  getTotal: () => {
    const { cart } = get()
    return cart.reduce((total, item) => {
      const quantity = item.quantity ?? 1
      return total + item.price * quantity
    }, 0)
  },

  changeDishQuantity: (productId, quantity) => {
    if (quantity < 1) {
      return
    }

    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      )
      return {
        ...state,
        cart: updatedCart,
      }
    })

    get().persistCart()
  },
}))
