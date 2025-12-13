import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  base_price: number;
  is_active: boolean;
  category: string;
  rating: number;
  reviews_count: number;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  inventory_count: number;
  is_available: boolean;
}

interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface WishlistItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  wishlist: WishlistItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => boolean;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotalPrice: () => number;
  validateItem: (itemId: string) => boolean;
  getCartItems: () => CartItem[];
  isEmpty: () => boolean;
  addToWishlist: (product: Product, variant: ProductVariant) => boolean;
  removeFromWishlist: (itemId: string) => void;
  getWishlistCount: () => number;
  getWishlistItems: () => WishlistItem[];
  isInWishlist: (productId: string, variantId: string) => boolean;
  clearWishlist: () => void;
}

const MAX_QUANTITY_PER_ITEM = 10;
const FREE_SHIPPING_THRESHOLD = 100;
const TAX_RATE = 0.08;
const STANDARD_SHIPPING_COST = 10;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      /**
       * Add item to cart with validation
       * Returns true if successful, false if failed
       */
      addItem: (product, variant, quantity = 1) => {
        try {
          // Validate inputs
          if (!product?.id || !variant?.id) {
            console.warn('Invalid product or variant data');
            return false;
          }

          // Validate quantity
          const validQuantity = Math.max(1, Math.min(Math.floor(quantity), MAX_QUANTITY_PER_ITEM));

          // Check inventory
          if (!variant.is_available || variant.inventory_count < validQuantity) {
            console.warn('Insufficient inventory');
            return false;
          }

          const items = get().items;
          const existingItem = items.find(
            (item) => item.product.id === product.id && item.variant.id === variant.id
          );

          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + validQuantity,
              MAX_QUANTITY_PER_ITEM
            );

            // Check if new quantity exceeds max
            if (newQuantity > MAX_QUANTITY_PER_ITEM) {
              console.warn(`Maximum quantity per item is ${MAX_QUANTITY_PER_ITEM}`);
              return false;
            }

            set({
              items: items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            });
          } else {
            const newItem: CartItem = {
              id: `${product.id}-${variant.id}`,
              product,
              variant,
              quantity: validQuantity,
            };
            set({ items: [...items, newItem] });
          }

          return true;
        } catch (error) {
          console.error('Error adding item to cart:', error);
          return false;
        }
      },

      /**
       * Remove item from cart
       */
      removeItem: (itemId) => {
        try {
          if (!itemId) return;
          set({ items: get().items.filter((item) => item.id !== itemId) });
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
      },

      /**
       * Update item quantity with validation
       * Returns true if successful, false if failed
       */
      updateQuantity: (itemId, quantity) => {
        try {
          if (!itemId || typeof quantity !== 'number') {
            return false;
          }

          const validQuantity = Math.max(1, Math.min(Math.floor(quantity), MAX_QUANTITY_PER_ITEM));

          if (validQuantity < 1) {
            get().removeItem(itemId);
            return true;
          }

          // Validate inventory for updated quantity
          const item = get().items.find((i) => i.id === itemId);
          if (item && item.variant.inventory_count < validQuantity) {
            console.warn('Insufficient inventory for requested quantity');
            return false;
          }

          set({
            items: get().items.map((item) =>
              item.id === itemId ? { ...item, quantity: validQuantity } : item
            ),
          });

          return true;
        } catch (error) {
          console.error('Error updating quantity:', error);
          return false;
        }
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        try {
          set({ items: [] });
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },

      /**
       * Get total item count (sum of quantities)
       */
      getItemCount: () => {
        try {
          return get().items.reduce((total, item) => total + (item.quantity || 0), 0);
        } catch (error) {
          console.error('Error calculating item count:', error);
          return 0;
        }
      },

      /**
       * Get cart subtotal
       */
      getSubtotal: () => {
        try {
          return Math.max(
            0,
            get().items.reduce((total, item) => {
              const itemPrice = item.variant?.price || 0;
              const itemQuantity = item.quantity || 0;
              return total + itemPrice * itemQuantity;
            }, 0)
          );
        } catch (error) {
          console.error('Error calculating subtotal:', error);
          return 0;
        }
      },

      /**
       * Get shipping cost based on subtotal
       * Free shipping on orders >= $100
       */
      getShipping: () => {
        try {
          const subtotal = get().getSubtotal();
          return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
        } catch (error) {
          console.error('Error calculating shipping:', error);
          return STANDARD_SHIPPING_COST;
        }
      },

      /**
       * Get tax amount (8% of subtotal)
       */
      getTax: () => {
        try {
          const subtotal = get().getSubtotal();
          return Math.round(subtotal * TAX_RATE * 100) / 100;
        } catch (error) {
          console.error('Error calculating tax:', error);
          return 0;
        }
      },

      /**
       * Get total price (subtotal + shipping + tax)
       */
      getTotalPrice: () => {
        try {
          const subtotal = get().getSubtotal();
          const shipping = get().getShipping();
          const tax = get().getTax();
          return Math.round((subtotal + shipping + tax) * 100) / 100;
        } catch (error) {
          console.error('Error calculating total price:', error);
          return 0;
        }
      },

      /**
       * Validate if item still exists and is available
       */
      validateItem: (itemId) => {
        try {
          const item = get().items.find((i) => i.id === itemId);
          if (!item) return false;
          return item.variant.is_available && item.variant.inventory_count > 0;
        } catch (error) {
          console.error('Error validating item:', error);
          return false;
        }
      },

      /**
       * Get all cart items
       */
      getCartItems: () => {
        try {
          return get().items || [];
        } catch (error) {
          console.error('Error getting cart items:', error);
          return [];
        }
      },

      /**
       * Check if cart is empty
       */
      isEmpty: () => {
        try {
          return get().items.length === 0;
        } catch (error) {
          console.error('Error checking if cart is empty:', error);
          return true;
        }
      },

      /**
       * Add item to wishlist
       * Returns true if successful, false if already in wishlist
       */
      addToWishlist: (product, variant) => {
        try {
          if (!product?.id || !variant?.id) {
            console.warn('Invalid product or variant data');
            return false;
          }

          const wishlist = get().wishlist;
          const existingItem = wishlist.find(
            (item) => item.product.id === product.id && item.variant.id === variant.id
          );

          if (existingItem) {
            console.warn('Item already in wishlist');
            return false;
          }

          const newWishlistItem: WishlistItem = {
            id: `${product.id}-${variant.id}`,
            product,
            variant,
            addedAt: new Date().toISOString(),
          };

          set({ wishlist: [...wishlist, newWishlistItem] });
          return true;
        } catch (error) {
          console.error('Error adding item to wishlist:', error);
          return false;
        }
      },

      /**
       * Remove item from wishlist
       */
      removeFromWishlist: (itemId) => {
        try {
          if (!itemId) return;
          set({ wishlist: get().wishlist.filter((item) => item.id !== itemId) });
        } catch (error) {
          console.error('Error removing item from wishlist:', error);
        }
      },

      /**
       * Get wishlist item count
       */
      getWishlistCount: () => {
        try {
          return get().wishlist.length;
        } catch (error) {
          console.error('Error calculating wishlist count:', error);
          return 0;
        }
      },

      /**
       * Get all wishlist items
       */
      getWishlistItems: () => {
        try {
          return get().wishlist || [];
        } catch (error) {
          console.error('Error getting wishlist items:', error);
          return [];
        }
      },

      /**
       * Check if item is in wishlist
       */
      isInWishlist: (productId, variantId) => {
        try {
          if (!productId || !variantId) return false;
          return get().wishlist.some(
            (item) => item.product.id === productId && item.variant.id === variantId
          );
        } catch (error) {
          console.error('Error checking wishlist:', error);
          return false;
        }
      },

      /**
       * Clear all items from wishlist
       */
      clearWishlist: () => {
        try {
          set({ wishlist: [] });
        } catch (error) {
          console.error('Error clearing wishlist:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number): CartStore => {
        if (version === 0) {
          // Migration logic for version 0 if needed
        }
        return persistedState as CartStore;
      },
    }
  )
);

// Export constants for use in other parts of the app
export const CART_CONSTANTS = {
  MAX_QUANTITY_PER_ITEM,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
  STANDARD_SHIPPING_COST,
};