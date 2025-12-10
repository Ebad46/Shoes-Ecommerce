// lib/wishlistUtils.ts

import toast from 'react-hot-toast';

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  base_price: number;
  category: string;
  rating: number;
  reviews_count: number;
  images: any[];
  created_at: string;
  is_active: boolean;
  added_at?: string;
}

/**
 * Add product to wishlist
 */
export const addToWishlist = (product: any): boolean => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    
    // Check if product already exists
    const exists = wishlist.some((item: any) => item.id === product.id);
    
    if (exists) {
      toast.error('Already in wishlist');
      return false;
    }

    // Add to wishlist with timestamp
    const wishlistItem = {
      ...product,
      added_at: new Date().toISOString(),
    };

    wishlist.push(wishlistItem);
    localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
    toast.success('Added to wishlist!');
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
    return false;
  }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = (productId: string): boolean => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    const updated = wishlist.filter((item: any) => item.id !== productId);
    localStorage.setItem('user_wishlist', JSON.stringify(updated));
    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist');
    return false;
  }
};

/**
 * Check if product is in wishlist
 */
export const isInWishlist = (productId: string): boolean => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    return wishlist.some((item: any) => item.id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

/**
 * Get wishlist count
 */
export const getWishlistCount = (): number => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    return wishlist.length;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};

/**
 * Toggle product in/out of wishlist
 */
export const toggleWishlist = (product: any): boolean => {
  const isInList = isInWishlist(product.id);
  if (isInList) {
    return removeFromWishlist(product.id);
  } else {
    return addToWishlist(product);
  }
};

/**
 * Get all wishlist products
 */
export const getWishlist = (): WishlistProduct[] => {
  try {
    return JSON.parse(localStorage.getItem('user_wishlist') || '[]');
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

/**
 * Clear entire wishlist
 */
export const clearWishlist = (): boolean => {
  try {
    localStorage.setItem('user_wishlist', JSON.stringify([]));
    toast.success('Wishlist cleared');
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    toast.error('Failed to clear wishlist');
    return false;
  }
};