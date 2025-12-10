'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Share2, Trash2, Eye, Star, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/lib/wishlistUtils';

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
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
    
    // Load all products from localStorage
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    setAllProducts(products);

    // Load wishlist from localStorage
    let savedWishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    
    // If wishlist is empty, create sample from products
    if (savedWishlist.length === 0 && products.length > 0) {
      savedWishlist = products.slice(0, Math.min(5, products.length)).map((product: Product) => ({
        ...product,
        added_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
    }

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlistLocal = (productId: string) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    setWishlist(updated);
    localStorage.setItem('user_wishlist', JSON.stringify(updated));
    setSelectedItems(selectedItems.filter((item) => item !== productId));
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const addToCart = (product: WishlistProduct) => {
    try {
      addItem({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        quantity: 1,
        price: product.base_price,
        image: product.images[0]?.url || '/placeholder.png',
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelect = () => {
    if (selectedItems.length === filteredWishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredWishlist.map((item) => item.id));
    }
  };

  const addAllToCart = () => {
    const selected = wishlist.filter((item) => selectedItems.includes(item.id));
    if (selected.length === 0) {
      toast.error('Please select items to add to cart');
      return;
    }

    selected.forEach((product) => {
      addToCart(product);
    });

    setSelectedItems([]);
  };

  const shareWishlist = () => {
    const wishlistUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/wishlist/share/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(wishlistUrl);
    toast.success('Wishlist link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
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
  };

  const getCategories = () => {
    return Array.from(new Set(wishlist.map((item) => item.category)));
  };

  let filteredWishlist = wishlist.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  // Sort
  filteredWishlist.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.base_price - b.base_price;
      case 'price-high':
        return b.base_price - a.base_price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
    }
  });

  if (!mounted) return null;

  const totalPrice = selectedItems.reduce(
    (sum, id) => sum + (wishlist.find((item) => item.id === id)?.base_price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
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
              onClick={shareWishlist}
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
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your wishlist is empty</h2>
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
                    checked={selectedItems.length === filteredWishlist.length && filteredWishlist.length > 0}
                    onChange={toggleAllSelect}
                    className="w-5 h-5 rounded border-neutral-300 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Select All ({selectedItems.length}/{wishlist.length})
                  </span>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="all">All Categories</option>
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Add to Cart Button */}
                {selectedItems.length > 0 && (
                  <button
                    onClick={addAllToCart}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:col-span-2 lg:col-span-1"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWishlist.map((product) => {
                const isSelected = selectedItems.includes(product.id);

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
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-neutral-500 text-sm mt-2">No image</p>
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
                              />
                            ))}
                          </div>
                          <span className="text-xs text-neutral-600">({product.reviews_count})</span>
                        </div>

                        {/* Price and Date */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                          <div>
                            <p className="text-xs text-neutral-600 mb-1">Price</p>
                            <p className="text-xl font-bold text-neutral-900">${product.base_price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-neutral-600 mb-1">Added</p>
                            <p className="text-sm font-medium text-neutral-900">
                              {formatDate(product.added_at)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 mt-auto">
                          <Link href={`/products/${product.slug}`} className="block">
                            <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                              <Eye size={16} />
                              View Details
                            </button>
                          </Link>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlistLocal(product.id)}
                            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-red-200"
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

            {/* Summary Bar - Fixed Bottom */}
            {selectedItems.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedItems([])}
                      className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={addAllToCart}
                      className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Padding for Fixed Bar */}
            {selectedItems.length > 0 && <div className="h-20" />}
          </div>
        )}
      </div>
    </div>
  );
}