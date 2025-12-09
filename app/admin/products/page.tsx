'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, LogOut, BarChart3, ShoppingBag, Package } from 'lucide-react';
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

  // Load products from localStorage only
  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    setProducts(allProducts);
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-neutral-900">
                SoleStore Admin
              </Link>
              <Badge variant="info">Products</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 w-64"
                />
              </div>
              <Button variant="ghost" onClick={handleLogout} icon={<LogOut size={18} />}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
            >
              <Package size={20} />
              <span className="font-medium">Products</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="font-medium">Orders</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Products</h1>
                <p className="text-neutral-600">
                  Manage your product catalog ({filteredProducts.length} products)
                </p>
              </div>
              <Link href="/admin/products/add">
                <Button icon={<Plus size={18} />}>Add Product</Button>
              </Link>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-neutral-600 mb-4">No products found</p>
                  <Link href="/admin/products/add">
                    <Button icon={<Plus size={18} />}>Add Your First Product</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-medium transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-neutral-600">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span>{product.category}</span>
                                <span>•</span>
                                <Badge variant={product.is_active ? 'success' : 'default'} size="sm">
                                  {product.is_active ? 'Active' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-neutral-900">
                                {formatPrice(product.base_price)}
                              </p>
                              <p className="text-sm text-neutral-600">
                                {product.reviews_count} reviews
                              </p>
                            </div>
                          </div>

                          <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-2">
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <Button size="sm" variant="outline" icon={<Eye size={16} />}>
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={<Edit size={16} />}
                              onClick={() => toast.success('Edit functionality coming soon!')}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
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