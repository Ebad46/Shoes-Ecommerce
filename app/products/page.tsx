'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Star, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

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

interface Variant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  price: number;
  inventory_count: number;
  is_available: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    size: true,
    price: true,
  });

  // Load products and variants from localStorage only
  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const allVariants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
    setProducts(allProducts);
    setVariants(allVariants);

    // Set initial price range based on products
    if (allProducts.length > 0) {
      const prices = allProducts.map((p: Product) => p.base_price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, []);

  // Get unique values for filters
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  const sizes = Array.from(new Set(variants.map(v => v.size))).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    return numA - numB;
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSearchQuery('');
    const prices = products.map(p => p.base_price);
    setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
  };

  // Filter products
  let filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Brand filter
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    
    // Price filter
    // Price filter - only apply if values are set (not zero)
    const matchesPrice = (priceRange[0] === 0 && priceRange[1] === 0)
      ? true
      : product.base_price >= (priceRange[0] || 0) && product.base_price <= (priceRange[1] || 999999);
    
    // Size filter
    let matchesSize = true;
    if (selectedSizes.length > 0) {
      const productVariants = variants.filter(v => v.product_id === product.id);
      matchesSize = productVariants.some(v => selectedSizes.includes(v.size) && v.is_available);
    }
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesSize && product.is_active;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.base_price - b.base_price;
      case 'price-high':
        return b.base_price - a.base_price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    selectedSizes.length;
    

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold text-neutral-900">
              SoleStore
            </Link>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <Link href="/cart">
              <Button variant="outline" icon={<ShoppingCart size={18} />}>
                Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">All Products</h1>
            <p className="text-neutral-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg"
          >
            <Filter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" size="sm">{activeFiltersCount}</Badge>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="font-semibold text-neutral-900">Category</h3>
                    {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.category && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === 'all'
                            ? 'bg-neutral-900 text-white'
                            : 'hover:bg-neutral-100'
                        }`}
                      >
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category
                              ? 'bg-neutral-900 text-white'
                              : 'hover:bg-neutral-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand Filter */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <button
                    onClick={() => toggleSection('brand')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="font-semibold text-neutral-900">Brand</h3>
                    {expandedSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.brand && (
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 rounded border-neutral-300"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size Filter */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <button
                    onClick={() => toggleSection('size')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="font-semibold text-neutral-900">Size</h3>
                    {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.size && (
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-300 hover:border-neutral-900'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="font-semibold text-neutral-900">Price Range</h3>
                    {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.price && (
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Min"
                        />
                        <span className="text-neutral-600">-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Max"
                        />
                      </div>
                      <div className="text-sm text-neutral-600">
                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-600">
                Showing {filteredProducts.length} results
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-neutral-600 mb-4">No products found</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-neutral-100 overflow-hidden rounded-t-lg">
                          <Image
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.images[0]?.alt || product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge variant="info">{product.category}</Badge>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <p className="text-sm text-neutral-600 mb-1">{product.brand}</p>
                          <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
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
                            <span className="text-xs text-neutral-600">
                              ({product.reviews_count})
                            </span>
                          </div>

                          {/* Price */}
                          <p className="text-xl font-bold text-neutral-900">
                            {formatPrice(product.base_price)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}