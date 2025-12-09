'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  // Only render cart count after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white text-center py-2 text-sm">
        <p>Free shipping on orders over $100 | Shop Now</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-neutral-900">
            SoleStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/products?category=running"
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Running
            </Link>
            <Link
              href="/products?category=lifestyle"
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Lifestyle
            </Link>
            <Link
              href="/products?category=casual"
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Casual
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
              <Search size={20} />
            </button>

            {/* User Account */}
            <Link href="/admin/login" className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
              <User size={20} />
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-neutral-700 hover:text-neutral-900 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/products?category=running"
              className="block text-neutral-700 hover:text-neutral-900 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Running
            </Link>
            <Link
              href="/products?category=lifestyle"
              className="block text-neutral-700 hover:text-neutral-900 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Lifestyle
            </Link>
            <Link
              href="/products?category=casual"
              className="block text-neutral-700 hover:text-neutral-900 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Casual
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}