'use client';

import { useState, useEffect } from 'react';
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
  Eye,
  Menu,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

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
              <Badge variant="success">Dashboard</Badge>
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
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
            >
              <BarChart3 size={20} />
              <span className="font-medium text-sm md:text-base">Dashboard</span>
            </Link>
            <Link
              href="/admin/products"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
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
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">Dashboard</h1>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600">Welcome back! Here`s your store overview.</p>
              </div>
              <Link href="/admin/products/add" className="w-full sm:w-auto">
                <Button icon={<Plus size={18} />} className="w-full sm:w-auto text-sm md:text-base">
                  Add Product
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900">
                        {stat.icon}
                      </div>
                      <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                        stat.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                  <Link href="/admin/orders" className="w-full xs:w-auto">
                    <Button size="sm" variant="outline" className="w-full xs:w-auto text-xs sm:text-sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 p-3 sm:p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-xs sm:text-sm text-neutral-900">{order.id}</p>
                          <Badge variant={getStatusColor(order.status)} size="sm">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 truncate">{order.customer}</p>
                        <p className="text-xs sm:text-sm text-neutral-600 truncate">{order.product}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm sm:text-base text-neutral-900 mb-1">
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