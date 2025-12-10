'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, LogOut, BarChart3, ShoppingBag, Package, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const sampleOrders = [
  {
    id: 'ORD-2024-001',
    customer: 'John Doe',
    email: 'john@example.com',
    product: 'Air Max 270 React',
    quantity: 1,
    total: 159.99,
    status: 'completed',
    date: '2024-01-20T10:30:00Z',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    product: 'Ultraboost 22',
    quantity: 2,
    total: 379.98,
    status: 'processing',
    date: '2024-01-20T14:15:00Z',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    product: 'Jordan 1 Retro High',
    quantity: 1,
    total: 179.99,
    status: 'shipped',
    date: '2024-01-19T09:45:00Z',
  },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(sampleOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success('Order status updated');
  };

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

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
              <Badge variant="info">Orders</Badge>
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
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Package size={20} />
              <span className="font-medium text-sm md:text-base">Products</span>
            </Link>
            <Link
              href="/admin/orders"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
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
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">Orders</h1>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600">
                Manage customer orders ({filteredOrders.length} orders)
              </p>
            </div>

            {/* Filter Section */}
            <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
                <span className="text-xs sm:text-sm font-medium text-neutral-700 whitespace-nowrap">Filter:</span>
                <div className="flex flex-wrap gap-2 w-full xs:w-auto">
                  {['all', 'pending', 'processing', 'shipped', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                        filterStatus === status
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Orders - Table View (Desktop) / Card View (Mobile) */}
            {isMobile ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-sm text-neutral-900">{order.id}</p>
                            <p className="text-xs text-neutral-600 mt-0.5">{formatDate(order.date)}</p>
                          </div>
                          <Badge variant={getStatusColor(order.status)} size="sm">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="border-t border-neutral-200 pt-3">
                          <p className="text-sm font-medium text-neutral-900">{order.customer}</p>
                          <p className="text-xs text-neutral-600">{order.email}</p>
                        </div>

                        <div className="border-t border-neutral-200 pt-3">
                          <p className="text-sm text-neutral-700">{order.product}</p>
                          <p className="text-xs text-neutral-600">Qty: {order.quantity}</p>
                          <p className="text-sm font-bold text-neutral-900 mt-2">{formatPrice(order.total)}</p>
                        </div>

                        <div className="border-t border-neutral-200 pt-3 space-y-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="w-full px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border-2 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<Eye size={14} />}
                            onClick={() => toast.success(`Viewing ${order.id}`)}
                            className="w-full text-xs"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm">Order ID</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm">Customer</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm hidden lg:table-cell">Product</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm hidden sm:table-cell">Date</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm">Total</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm">Status</th>
                          <th className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-neutral-900 text-xs md:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="py-3 px-4 md:py-4 md:px-6 font-medium text-neutral-900 text-xs md:text-sm">{order.id}</td>
                            <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                              <div>
                                <p className="font-medium text-neutral-900">{order.customer}</p>
                                <p className="text-neutral-600 hidden xs:block">{order.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 md:py-4 md:px-6 text-neutral-700 text-xs md:text-sm hidden lg:table-cell">
                              <p>{order.product}</p>
                              <p className="text-neutral-600">Qty: {order.quantity}</p>
                            </td>
                            <td className="py-3 px-4 md:py-4 md:px-6 text-neutral-600 text-xs md:text-sm hidden sm:table-cell">
                              {formatDate(order.date)}
                            </td>
                            <td className="py-3 px-4 md:py-4 md:px-6 font-medium text-neutral-900 text-xs md:text-sm">
                              {formatPrice(order.total)}
                            </td>
                            <td className="py-3 px-4 md:py-4 md:px-6">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg border-2 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 md:py-4 md:px-6">
                              <Button
                                size="sm"
                                variant="outline"
                                icon={<Eye size={14} />}
                                onClick={() => toast.success(`Viewing ${order.id}`)}
                                className="text-xs"
                              >
                                <span className="hidden xs:inline">View</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}