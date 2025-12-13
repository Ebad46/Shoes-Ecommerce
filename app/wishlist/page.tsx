'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Share2,
  Trash2,
  Eye,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { removeFromWishlist } from '@/lib/wishlistUtils';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';

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

interface WishlistProduct extends Product {
  added_at: string;
}

export default function WishlistPage() {
  const [isClient, setIsClient] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { addItem } = useCartStore();

  // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    loadWishlistData();
  }, []);

  const loadWishlistData = useCallback(() => {
    try {
      const products = JSON.parse(
        localStorage.getItem('admin_products') || '[]'
      ) as Product[];
      let savedWishlist = JSON.parse(
        localStorage.getItem('user_wishlist') || '[]'
      ) as WishlistProduct[];

      // If wishlist is empty, create sample from products
      if (savedWishlist.length === 0 && products.length > 0) {
        savedWishlist = products
          .slice(0, Math.min(5, products.length))
          .map((product: Product) => ({
            ...product,
            added_at: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }));
      }

      setWishlist(savedWishlist);
    } catch (error) {
      console.error('Failed to load wishlist data:', error);
      toast.error('Failed to load wishlist');
    }
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(wishlist.map((item) => item.category))).sort(),
    [wishlist]
  );

  const filteredWishlist = useMemo(() => {
    let filtered = wishlist.filter((item) => {
      if (filterCategory === 'all') return true;
      return item.category === filterCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.base_price - b.base_price;
        case 'price-high':
          return b.base_price - a.base_price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
      }
    });

    return filtered;
  }, [wishlist, filterCategory, sortBy]);

  const totalPrice = useMemo(() => {
    return Array.from(selectedItems).reduce((sum, id) => {
      const product = wishlist.find((item) => item.id === id);
      return sum + (product?.base_price || 0);
    }, 0);
  }, [selectedItems, wishlist]);

  const handleRemoveFromWishlist = useCallback((productId: string) => {
    try {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  }, []);

  const handleAddToCart = useCallback(
    (product: WishlistProduct) => {
      try {
        // Add to Zustand store (automatically persists to localStorage via middleware)
        addItem(product, {} as any);
        
        toast.success(`${product.name} added to cart!`);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add to cart');
      }
    },
    [addItem]
  );

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAllSelect = useCallback(() => {
    if (selectedItems.size === filteredWishlist.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredWishlist.map((item) => item.id)));
    }
  }, [selectedItems.size, filteredWishlist]);

  const handleAddAllToCart = useCallback(() => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to add to cart');
      return;
    }

    const selected = wishlist.filter((item) => selectedItems.has(item.id));
    let successCount = 0;

    selected.forEach((product) => {
      try {
        // Add to Zustand store (automatically persists to localStorage via middleware)
        addItem(product, {} as any);
        successCount++;
      } catch (error) {
        console.error(`Failed to add ${product.name}:`, error);
      }
    });

    if (successCount === selected.length) {
      toast.success(`${successCount} items added to cart!`);
      setSelectedItems(new Set());
    } else if (successCount > 0) {
      toast.success(
        `${successCount}/${selected.length} items added to cart`
      );
      setSelectedItems(new Set());
    } else {
      toast.error('Failed to add items to cart');
    }
  }, [selectedItems, wishlist, addItem]);

  const handleShareWishlist = useCallback(() => {
    try {
      const wishlistUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/wishlist/share/${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      navigator.clipboard.writeText(wishlistUrl);
      toast.success('Wishlist link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Unknown';
    }
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pb-32 sm:pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
                <Heart className="fill-red-500 text-red-500" size={36} />
                My Wishlist
              </h1>
              <p className="text-neutral-300 mt-2">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <button
              onClick={handleShareWishlist}
              aria-label="Share wishlist"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {wishlist.length === 0 ? (
          // Empty State
          <Card className="p-12 text-center">
            <Heart size={64} className="mx-auto mb-4 text-neutral-300" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-neutral-600 mb-6">
              Add items to your wishlist to save them for later
            </p>
            <Link href="/products">
              <Button icon={<ArrowRight size={18} />}>
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Select All */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      selectedItems.size === filteredWishlist.length &&
                      filteredWishlist.length > 0
                    }
                    onChange={toggleAllSelect}
                    className="w-5 h-5 rounded border-neutral-300 cursor-pointer"
                    aria-label="Select all items"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-neutral-700 cursor-pointer">
                    Select All ({selectedItems.size}/{wishlist.length})
                  </label>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort-select" className="sr-only">
                    Sort by
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Filter */}
                <div>
                  <label htmlFor="category-filter" className="sr-only">
                    Filter by category
                  </label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add to Cart Button */}
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleAddAllToCart}
                    aria-label={`Add ${selectedItems.size} items to cart`}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:col-span-2 lg:col-span-1"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart ({selectedItems.size})
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Grid */}
            {filteredWishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWishlist.map((product) => {
                  const isSelected = selectedItems.has(product.id);

                  return (
                    <Card
                      key={product.id}
                      className={`overflow-hidden hover:shadow-xl transition-all h-full group border-2 ${
                        isSelected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                      }`}
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Header with Checkbox and Category */}
                        <div className="flex items-start justify-between p-3 bg-neutral-50 border-b border-neutral-100">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(product.id)}
                            className="w-5 h-5 rounded border-neutral-300 cursor-pointer accent-neutral-900 mt-0.5"
                            aria-label={`Select ${product.name}`}
                          />
                          <Badge className="bg-white text-neutral-900 border border-neutral-200">
                            {product.category}
                          </Badge>
                        </div>

                        {/* Product Image */}
                        <div className="relative aspect-square bg-neutral-100 overflow-hidden flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0].url}
                              alt={
                                product.images[0].alt || product.name
                              }
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-center">
                              <svg
                                className="w-16 h-16 mx-auto text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-neutral-500 text-sm mt-2">
                                No image
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col flex-grow">
                          <p className="text-xs font-semibold text-neutral-600 uppercase mb-1">
                            {product.brand}
                          </p>
                          <h3 className="font-bold text-neutral-900 mb-3 line-clamp-2 text-sm">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-neutral-300'
                                  }
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-600">
                              ({product.reviews_count})
                            </span>
                          </div>

                          {/* Price and Date */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                            <div>
                              <p className="text-xs text-neutral-600 mb-1">
                                Price
                              </p>
                              <p className="text-xl font-bold text-neutral-900">
                                ${product.base_price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-neutral-600 mb-1">
                                Added
                              </p>
                              <p className="text-sm font-medium text-neutral-900">
                                {formatDate(product.added_at)}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2 mt-auto">
                            <Link href={`/products/${product.slug}`}>
                              <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                                <Eye size={16} />
                                View Details
                              </button>
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFromWishlist(product.id)
                              }
                              className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-red-200"
                              aria-label={`Remove ${product.name} from wishlist`}
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-neutral-600">
                  No items match your filters
                </p>
              </Card>
            )}

            {/* Summary Bar - Sticky Bottom */}
            {selectedItems.size > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {selectedItems.size} item
                      {selectedItems.size !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedItems(new Set())}
                      className="flex-1 sm:flex-none px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleAddAllToCart}
                      className="flex-1 sm:flex-none px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}