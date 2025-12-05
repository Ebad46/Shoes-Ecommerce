'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { sampleProducts, brands, sizes, colors, categories } from '@/lib/utils/sample-data';
import { ProductFilters, SortOption } from '@/types';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    brand: [],
    size: [],
    color: [],
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'newest',
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...sampleProducts];

    // Apply category filter
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Apply brand filter
    if (filters.brand && filters.brand.length > 0) {
      result = result.filter((p) => filters.brand?.includes(p.brand));
    }

    // Apply price filter
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.base_price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.base_price <= filters.maxPrice!);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviews_count - a.reviews_count);
        break;
    }

    return result;
  }, [filters]);

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand?.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...(prev.brand || []), brand],
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: [],
      size: [],
      color: [],
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest',
    });
  };

  const activeFiltersCount = 
    (filters.brand?.length || 0) +
    (filters.size?.length || 0) +
    (filters.color?.length || 0) +
    (filters.category ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">All Products</h1>
          <p className="text-neutral-600">
            Showing {filteredProducts.length} of {sampleProducts.length} products
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal size={18} />}
              className="lg:hidden"
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-neutral-900 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-600 hover:text-neutral-900 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => setFilters({ ...filters, category: undefined })}
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                    <span className="text-sm text-neutral-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => setFilters({ ...filters, category })}
                        className="text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Brand</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand?.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => {
                    const isSelected = filters.size?.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            size: isSelected
                              ? filters.size?.filter((s) => s !== size)
                              : [...(filters.size || []), size],
                          })
                        }
                        className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-neutral-600 mb-4">No products found</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>
            {/* Same filter content as desktop sidebar */}
            <div className="space-y-6">
              {/* Copy the filter sections from desktop sidebar */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
