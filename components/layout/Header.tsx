'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useCartStore((state) => state.getWishlistCount?.() || 0);

  // Load products from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    setAllProducts(products);
  }, []);

  // Handle live search with real product data
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim().length > 0) {
      // Use the same search logic as the products page
      const filtered = allProducts.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.brand.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase());
        
        return matchesSearch && product.is_active;
      });
      
      setSearchResults(filtered.slice(0, 6)); // Limit to 6 results
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle navigation from search result
  const handleSearchResultClick = (slug: string) => {
    window.location.href = `/products/${slug}`;
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white text-center py-2 text-xs sm:text-sm font-medium">
        Free shipping on orders over $100 • Use code: SOLE2024
      </div>

      {/* Main Header */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="text-2xl font-black text-neutral-900 tracking-tight">
                SoleStore
              </div>
              <div className="text-xs text-neutral-500 font-medium">Premium Sneakers</div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              <NavLink href="/products" label="All Products" />
              <NavLink href="/products?category=running" label="Running" badge="New" />
              <NavLink href="/products?category=lifestyle" label="Lifestyle" />
              <NavLink href="/products?category=casual" label="Casual" />
              <NavLink href="/products?sort=trending" label="Trending" />
              <NavLink href="/products?tag=sale" label="Sale" badge="Hot" badgeColor="red" />
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Desktop Search */}
              <div ref={searchRef} className="hidden md:block flex-1 max-w-2xl relative">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                    />
                  </div>
                </form>

                {/* Live Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden z-50">
                    {/* Results List */}
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchResultClick(product.slug)}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-xs text-neutral-500 mt-0.5">
                              {product.brand} • {product.category}
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <div className="font-semibold text-neutral-900">
                              ${product.base_price}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* View All Results Link */}
                    <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3">
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors flex items-center justify-between"
                      >
                        <span>View all results for "{searchQuery}"</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {showSearchResults && searchQuery && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg p-6 text-center z-50">
                    <p className="text-neutral-500 text-sm">
                      No products found for "{searchQuery}"
                    </p>
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                      className="text-sm font-medium text-neutral-900 hover:underline mt-2 inline-block"
                    >
                      Search all products
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-neutral-700 hover:bg-neutral-100 p-2 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <Heart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              <Link href="/profile" className="hidden sm:flex p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <User size={20} />
              </Link>

              {/* Shopping Cart */}
              <Link href="/cart" className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <ShoppingCart size={20} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          {/* Mobile Search */}
          <div className="border-b border-neutral-200 p-4">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </form>

            {/* Mobile Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setSearchQuery('');
                      setIsMenuOpen(false);
                    }}
                    className="block px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100"
                  >
                    <div className="font-medium text-sm text-neutral-900">{product.name}</div>
                    <div className="text-xs text-neutral-500">{product.brand} • ${product.base_price}</div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">
                No products found
              </p>
            )}
          </div>

          {/* Mobile Navigation */}
          <nav className="px-4 py-3 space-y-1">
            <MobileNavLink href="/products" label="All Products" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink href="/products?category=running" label="Running" badge="New" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink href="/products?category=lifestyle" label="Lifestyle" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink href="/products?category=casual" label="Casual" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink href="/products?sort=trending" label="Trending" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink href="/products?tag=sale" label="Sale" badge="Hot" badgeColor="red" onClick={() => setIsMenuOpen(false)} />

            {/* Account Links */}
            <div className="border-t border-neutral-200 mt-4 pt-4">
              <MobileNavLink href="/admin/login" label="My Account" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/about" label="About Us" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/contact" label="Contact & Support" onClick={() => setIsMenuOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  badge?: string;
  badgeColor?: 'blue' | 'red';
}

function NavLink({ href, label, badge, badgeColor = 'blue' }: NavLinkProps) {
  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors relative group"
    >
      <div className="flex items-center gap-1.5">
        {label}
        {badge && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="absolute bottom-1 left-3 right-3 h-0.5 bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  label: string;
  badge?: string;
  badgeColor?: 'blue' | 'red';
  onClick?: () => void;
}

function MobileNavLink({ href, label, badge, badgeColor = 'blue', onClick }: MobileNavLinkProps) {
  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {label}
          {badge && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}