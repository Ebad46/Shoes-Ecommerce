'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  LogOut,
  Search,
  Eye
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0';
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(45231.89),
      change: '+20.1%',
      isPositive: true,
      icon: <BarChart3 size={24} />,
    },
    {
      title: 'Orders',
      value: '356',
      change: '+12.5%',
      isPositive: true,
      icon: <ShoppingBag size={24} />,
    },
    {
      title: 'Products',
      value: '8',
      change: '+2',
      isPositive: true,
      icon: <Package size={24} />,
    },
    {
      title: 'Customers',
      value: '2,156',
      change: '-3.2%',
      isPositive: false,
      icon: <Users size={24} />,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'John Doe',
      product: 'Air Max 270 React',
      total: 159.99,
      status: 'completed',
      date: '2024-01-20T10:30:00Z',
    },
    {
      id: 'ORD-2024-002',
      customer: 'Jane Smith',
      product: 'Ultraboost 22',
      total: 189.99,
      status: 'processing',
      date: '2024-01-20T14:15:00Z',
    },
    {
      id: 'ORD-2024-003',
      customer: 'Mike Johnson',
      product: 'Jordan 1 Retro High',
      total: 179.99,
      status: 'shipped',
      date: '2024-01-19T09:45:00Z',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-neutral-900">
                SoleStore Admin
              </Link>
              <Badge variant="success">Dashboard</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
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
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
            >
              <BarChart3 size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
                <p className="text-neutral-600">Welcome back! Here's your store overview.</p>
              </div>
              <Link href="/admin/products/add">
                <Button icon={<Plus size={18} />}>Add Product</Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900">
                        {stat.icon}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-neutral-600">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button size="sm" variant="outline">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-neutral-900">{order.id}</p>
                          <Badge variant={getStatusColor(order.status)} size="sm">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600">{order.customer}</p>
                        <p className="text-sm text-neutral-600">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900 mb-1">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs text-neutral-600">{formatDate(order.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}