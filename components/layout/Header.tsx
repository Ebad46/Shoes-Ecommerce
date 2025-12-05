'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { categories } from '@/lib/utils/sample-data';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white text-center py-2 text-sm">
        <p>Free shipping on orders over $100 | Shop Now</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900 hidden sm:block">
              SoleStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition">
              All Products
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition"
              >
                {category}
              </Link>
            ))}
            <Link href="/products?sale=true" className="text-sm font-medium text-red-600 hover:text-red-700 transition">
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:block p-2 text-neutral-700 hover:text-neutral-900 transition">
              <Heart size={20} />
            </Link>

            {/* Account */}
            <Link href="/account" className="hidden sm:block p-2 text-neutral-700 hover:text-neutral-900 transition">
              <User size={20} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-neutral-900 transition">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for shoes..."
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-neutral-200 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link
                href="/products"
                className="block py-2 text-base font-medium text-neutral-700 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${category}`}
                  className="block py-2 text-base font-medium text-neutral-700 hover:text-neutral-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <Link
                href="/products?sale=true"
                className="block py-2 text-base font-medium text-red-600 hover:text-red-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale
              </Link>
              <div className="pt-4 mt-4 border-t border-neutral-200">
                <Link
                  href="/account"
                  className="block py-2 text-base font-medium text-neutral-700 hover:text-neutral-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="block py-2 text-base font-medium text-neutral-700 hover:text-neutral-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
