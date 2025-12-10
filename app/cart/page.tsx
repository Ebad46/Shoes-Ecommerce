'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotalPrice } = useCartStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8 sm:py-12 md:py-16">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card className="p-6 sm:p-8 md:p-12">
              <div className="text-center">
                <ShoppingBag className="mx-auto h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 text-neutral-400 mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-6 sm:mb-8">
                  Looks like you haven`t added any items to your cart yet.
                </p>
                <Link href="/products" className="inline-block">
                  <Button icon={<ArrowRight size={18} />} className="text-xs sm:text-sm md:text-base">Continue Shopping</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-neutral-50 py-6 sm:py-8 md:py-12">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-6 md:mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col xs:flex-row gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-neutral-200 last:border-0"
                      >
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="relative w-full xs:w-20 sm:w-24 h-32 xs:h-20 sm:h-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={item.product.images[0]?.url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 96px"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="font-semibold text-sm sm:text-base text-neutral-900 hover:text-neutral-700 mb-1 line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-xs sm:text-sm text-neutral-600 mb-2">{item.product.brand}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                              <span>Size: {item.variant.size}</span>
                              <span>•</span>
                              <span>Color: {item.variant.color}</span>
                            </div>
                          </div>

                          {/* Mobile: Quantity Controls Below */}
                          <div className="xs:hidden mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors flex items-center justify-center"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors flex items-center justify-center"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop: Quantity & Price */}
                        <div className="hidden xs:flex flex-col items-end justify-between gap-2">
                          <p className="font-bold text-sm sm:text-base text-neutral-900">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-4 sm:mt-6">
                <Link href="/products" className="block">
                  <Button variant="outline" icon={<ArrowRight size={18} />} className="w-full text-xs sm:text-sm">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-6 h-fit">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4 sm:mb-6">Order Summary</h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-700">
                    <span>Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 sm:pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-neutral-900">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-neutral-900">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 100 && (
                  <div className="mb-4 sm:mb-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-700">
                      Add {formatPrice(100 - subtotal)} more for free shipping!
                    </p>
                    <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full text-xs sm:text-sm md:text-base" icon={<ArrowRight size={18} />}>
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-center text-neutral-600 mt-3 sm:mt-4">
                  Secure checkout powered by Stripe
                </p>

                {/* Promo Code */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200">
                  <details className="group">
                    <summary className="cursor-pointer text-xs sm:text-sm font-medium text-neutral-900 flex items-center justify-between hover:text-neutral-700">
                      <span>Have a promo code?</span>
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <div className="mt-3 flex flex-col xs:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 text-xs sm:text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      <Button size="sm" className="text-xs sm:text-sm w-full xs:w-auto">Apply</Button>
                    </div>
                  </details>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}