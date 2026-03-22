import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
  variant?: string;
}

interface CartStore {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
  setHydrated: (state: boolean) => void;
  get totalItems(): number;
  get totalPrice(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.product === item.product);

        if (existingItem) {
          const newQty = Math.min(existingItem.qty + item.qty, item.stock);
          set({
            items: currentItems.map((i) =>
              i.product === item.product ? { ...i, qty: newQty, stock: item.stock } : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product !== productId) });
      },
      updateQuantity: (productId, qty) => {
        const items = get().items;
        const item = items.find((i) => i.product === productId);
        if (item) {
          const newQty = Math.max(1, Math.min(qty, item.stock));
          set({
            items: items.map((i) =>
              i.product === productId ? { ...i, qty: newQty } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      syncWithBackend: async () => {
        try {
          const items = get().items;
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },
      setHydrated: (state) => set({ isHydrated: state }),
      get totalItems() {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
      },
      get totalPrice() {
        return get().items.reduce((acc, item) => acc + item.price * item.qty, 0);
      },
    }),
    {
      name: 'premium-ecommerce-cart',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
