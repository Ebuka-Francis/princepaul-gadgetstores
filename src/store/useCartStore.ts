import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // Firebase doc ID string
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock?: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Omit<CartItem, "quantity">, quantityToAdd?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (product, quantityToAdd = 1) => {
        const { cart } = get();
        const existingIdx = cart.findIndex((item) => item.id === product.id);
        const maxStock = product.stock ?? 99;

        if (existingIdx > -1) {
          const updated = [...cart];
          const newQty = updated[existingIdx].quantity + quantityToAdd;
          updated[existingIdx].quantity = Math.min(newQty, maxStock);
          set({ cart: updated, isOpen: true });
        } else {
          set({
            cart: [
              ...cart,
              { ...product, quantity: Math.min(quantityToAdd, maxStock) },
            ],
            isOpen: true,
          });
        }
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, delta: number) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                const maxStock = item.stock ?? 99;
                return { ...item, quantity: Math.min(newQty, maxStock) };
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      clearCart: () => set({ cart: [] }),

      getSubtotal: () => {
        return get().cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().cart.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "pg_cart_zustand",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);