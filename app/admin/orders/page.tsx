'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, LogOut, BarChart3, ShoppingBag, Package } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-neutral-900">
                SoleStore Admin
              </Link>
              <Badge variant="info">Orders</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search orders..."
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
              className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Package size={20} />
              <span className="font-medium">Products</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg"
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
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Orders</h1>
                <p className="text-neutral-600">
                  Manage customer orders ({filteredOrders.length} orders)
                </p>
              </div>
            </div>

            <Card className="p-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-700">Filter:</span>
                <div className="flex gap-2">
                  {['all', 'pending', 'processing', 'shipped', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
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

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Order ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Customer</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Product</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Date</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Total</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-neutral-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-4 px-6 font-medium text-neutral-900">{order.id}</td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-neutral-900">{order.customer}</p>
                              <p className="text-sm text-neutral-600">{order.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-neutral-700">
                            <p>{order.product}</p>
                            <p className="text-sm text-neutral-600">Qty: {order.quantity}</p>
                          </td>
                          <td className="py-4 px-6 text-neutral-600 text-sm">
                            {formatDate(order.date)}
                          </td>
                          <td className="py-4 px-6 font-medium text-neutral-900">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              size="sm"
                              variant="outline"
                              icon={<Eye size={16} />}
                              onClick={() => toast.success(`Viewing ${order.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}