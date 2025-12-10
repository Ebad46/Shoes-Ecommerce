'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, LogOut, BarChart3, ShoppingBag, Package, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Load products from localStorage only
  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    setProducts(allProducts);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0';
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Remove from products
      const allProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));

      // Remove associated variants
      const allVariants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
      const updatedVariants = allVariants.filter((v: any) => v.product_id !== productId);
      localStorage.setItem('admin_variants', JSON.stringify(updatedVariants));

      setProducts(updatedProducts);
      toast.success('Product deleted successfully');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/admin/dashboard" className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 whitespace-nowrap">
              SoleStore Admin
            </Link>

            {/* Desktop Badge */}
            <div className="hidden xs:block">
              <Badge variant="info">Products</Badge>
            </div>

            {/* Search Bar - Responsive */}
            <div className="hidden sm:flex flex-1 md:flex-none relative max-w-xs md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 flex-shrink-0" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              icon={<LogOut size={16} />}
              className="text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative min-h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 z-40 md:z-0 md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:w-64 md:min-h-[calc(100vh-73px)] md:sticky md:top-[60px]`}
        >
          <nav className="p-4 space-y-2 mt-16 md:mt-0">
            <Link
              href="/admin/dashboard"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <BarChart3 size={20} />
              <span className="font-medium text-sm md:text-base">Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
            >
              <Package size={20} />
              <span className="font-medium text-sm md:text-base">Products</span>
            </Link>
            <Link
              href="/admin/orders"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="font-medium text-sm md:text-base">Orders</span>
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">Products</h1>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600">
                  Manage your product catalog ({filteredProducts.length} products)
                </p>
              </div>
              <Link href="/admin/products/add" className="w-full sm:w-auto">
                <Button icon={<Plus size={18} />} className="w-full sm:w-auto text-sm md:text-base">
                  Add Product
                </Button>
              </Link>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Card className="p-8 sm:p-12">
                <div className="text-center">
                  <p className="text-sm sm:text-base text-neutral-600 mb-4">No products found</p>
                  <Link href="/admin/products/add" className="inline-block">
                    <Button icon={<Plus size={18} />} className="text-sm md:text-base">Add Your First Product</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 sm:h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden aspect-square sm:aspect-auto">
                          <Image
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3 sm:mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1 line-clamp-2">
                                {product.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                                <span className="truncate">{product.brand}</span>
                                <span className="hidden xs:inline">•</span>
                                <span className="hidden xs:inline truncate">{product.category}</span>
                                <span className="xs:hidden">•</span>
                                <Badge variant={product.is_active ? 'success' : 'default'} size="sm">
                                  {product.is_active ? 'Active' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                                {formatPrice(product.base_price)}
                              </p>
                              <p className="text-xs sm:text-sm text-neutral-600">
                                {product.reviews_count} reviews
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-neutral-700 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Actions */}
                          <div className="flex flex-col xs:flex-row gap-2">
                            <Link href={`/products/${product.slug}`} target="_blank" className="flex-1 xs:flex-initial">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                icon={<Eye size={14} />}
                                className="w-full xs:w-auto text-xs"
                              >
                                <span className="hidden xs:inline">View</span>
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={<Edit size={14} />}
                              onClick={() => toast.success('Edit functionality coming soon!')}
                              className="flex-1 xs:flex-initial text-xs"
                            >
                              <span className="hidden xs:inline">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={<Trash2 size={14} />}
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 xs:flex-initial text-xs"
                            >
                              <span className="hidden xs:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}