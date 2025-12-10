'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Package, MapPin, Calendar, Phone, Mail, Edit, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, AlertCircle, Download, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface OrderProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  tracking_number?: string;
  estimated_delivery?: string;
  products: OrderProduct[];
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  profile_image?: string;
  created_at: string;
}

// Sample data
const sampleUser: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, Apt 4B',
  city: 'New York',
  state: 'NY',
  zip_code: '10001',
  country: 'United States',
  profile_image: undefined,
  created_at: '2023-01-15T00:00:00Z',
};

const sampleOrders: Order[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    user_id: '1',
    total_amount: 299.97,
    status: 'delivered',
    shipping_address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'United States',
    tracking_number: 'TRACK123456789',
    estimated_delivery: '2024-01-25',
    products: [
      {
        id: '1',
        product_id: '1',
        product_name: 'Nike Air Force 1',
        product_image: '/placeholder.png',
        quantity: 1,
        size: '10',
        color: 'White',
        price: 120,
      },
      {
        id: '2',
        product_id: '2',
        product_name: 'Adidas Ultraboost 22',
        product_image: '/placeholder.png',
        quantity: 1,
        size: '10',
        color: 'Black',
        price: 179.97,
      },
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-22T14:20:00Z',
  },
  {
    id: '2',
    order_number: 'ORD-2024-002',
    user_id: '1',
    total_amount: 179.99,
    status: 'shipped',
    shipping_address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'United States',
    tracking_number: 'TRACK987654321',
    estimated_delivery: '2024-01-28',
    products: [
      {
        id: '3',
        product_id: '3',
        product_name: 'Jordan 1 Retro High',
        product_image: '/placeholder.png',
        quantity: 1,
        size: '10',
        color: 'Red/Black',
        price: 179.99,
      },
    ],
    created_at: '2024-01-18T08:15:00Z',
    updated_at: '2024-01-20T11:45:00Z',
  },
  {
    id: '3',
    order_number: 'ORD-2024-003',
    user_id: '1',
    total_amount: 129.99,
    status: 'processing',
    shipping_address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'United States',
    tracking_number: undefined,
    estimated_delivery: '2024-02-02',
    products: [
      {
        id: '4',
        product_id: '4',
        product_name: 'Puma RS-X',
        product_image: '/placeholder.png',
        quantity: 1,
        size: '9.5',
        color: 'White/Navy',
        price: 129.99,
      },
    ],
    created_at: '2024-01-20T15:30:00Z',
    updated_at: '2024-01-21T09:20:00Z',
  },
];

export default function UserAccountComponent() {
  const [user, setUser] = useState<UserProfile>(sampleUser);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage if available
    const userData = localStorage.getItem('user_profile');
    const ordersData = localStorage.getItem('user_orders');

    if (userData) setUser(JSON.parse(userData));
    if (ordersData) setOrders(JSON.parse(ordersData));
  }, []);

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: {
        color: 'bg-yellow-50 border-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Pending',
      },
      processing: {
        color: 'bg-blue-50 border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        icon: Package,
        label: 'Processing',
      },
      shipped: {
        color: 'bg-purple-50 border-purple-200',
        badge: 'bg-purple-100 text-purple-800',
        icon: Truck,
        label: 'Shipped',
      },
      delivered: {
        color: 'bg-green-50 border-green-200',
        badge: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: 'Delivered',
      },
      cancelled: {
        color: 'bg-red-50 border-red-200',
        badge: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        label: 'Cancelled',
      },
    };
    return configs[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_profile');
    window.location.href = '/';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            {user.profile_image ? (
              <Image
                src={user.profile_image}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neutral-600 flex items-center justify-center border-4 border-white">
                <User size={40} className="text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-neutral-300 text-sm sm:text-base">Member since {formatDate(user.created_at)}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Package size={18} />
              <span className="hidden sm:inline">Orders</span>
              <Badge className="ml-1">{orders.length}</Badge>
            </span>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                <CardTitle className="flex items-center gap-2">
                  <Mail size={20} className="text-neutral-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Email</label>
                  <p className="text-neutral-900 font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Phone</label>
                  <p className="text-neutral-900 font-medium mt-1">{user.phone || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} className="text-neutral-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Address</label>
                  <p className="text-neutral-900 font-medium mt-1">{user.address || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 uppercase">City</label>
                    <p className="text-neutral-900 font-medium mt-1">{user.city || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 uppercase">State</label>
                    <p className="text-neutral-900 font-medium mt-1">{user.state || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 uppercase">ZIP Code</label>
                    <p className="text-neutral-900 font-medium mt-1">{user.zip_code || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 uppercase">Country</label>
                    <p className="text-neutral-900 font-medium mt-1">{user.country || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 text-lg">No orders yet</p>
                <Link href="/products" className="mt-4 inline-block">
                  <Button>Shop Now</Button>
                </Link>
              </Card>
            ) : (
              orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <Card
                    key={order.id}
                    className={`hover:shadow-lg transition-all border-l-4 ${
                      order.status === 'delivered'
                        ? 'border-l-green-500'
                        : order.status === 'shipped'
                        ? 'border-l-purple-500'
                        : order.status === 'processing'
                        ? 'border-l-blue-500'
                        : order.status === 'pending'
                        ? 'border-l-yellow-500'
                        : 'border-l-red-500'
                    }`}
                  >
                    {/* Order Header */}
                    <div
                      className={`p-4 sm:p-6 cursor-pointer transition-colors ${statusConfig.color} border-b`}
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-neutral-900">{order.order_number}</h3>
                            <Badge className={statusConfig.badge}>
                              <StatusIcon size={14} className="mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              {formatDate(order.created_at)}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{order.products.length} item(s)</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-neutral-600">Order Total</p>
                            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">${order.total_amount.toFixed(2)}</p>
                          </div>
                          <ChevronDown
                            size={24}
                            className={`text-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Order Details - Expanded */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-6">
                        {/* Products */}
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-4 text-lg">Products</h4>
                          <div className="space-y-3">
                            {order.products.map((product) => (
                              <div
                                key={product.id}
                                className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                              >
                                <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-200 rounded-lg overflow-hidden">
                                  <Image
                                    src={product.product_image}
                                    alt={product.product_name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-neutral-900 truncate">{product.product_name}</h5>
                                  <div className="text-sm text-neutral-600 mt-1 space-y-0.5">
                                    <p>Size: {product.size || 'N/A'}</p>
                                    <p>Color: {product.color || 'N/A'}</p>
                                    <p>Quantity: {product.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-bold text-neutral-900">${product.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                              <MapPin size={18} className="text-blue-600" />
                              Shipping Address
                            </h4>
                            <p className="text-sm text-neutral-700 space-y-1">
                              <div>{order.shipping_address}</div>
                              <div>
                                {order.city}, {order.state} {order.zip_code}
                              </div>
                              <div>{order.country}</div>
                            </p>
                          </div>

                          {order.tracking_number && (
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                              <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <Truck size={18} className="text-purple-600" />
                                Tracking
                              </h4>
                              <p className="text-sm text-neutral-700 space-y-2">
                                <div>
                                  <span className="text-xs text-neutral-600">Tracking Number</span>
                                  <p className="font-mono font-bold text-neutral-900">{order.tracking_number}</p>
                                </div>
                                {order.estimated_delivery && (
                                  <div>
                                    <span className="text-xs text-neutral-600">Est. Delivery</span>
                                    <p className="font-bold text-neutral-900">{formatDate(order.estimated_delivery)}</p>
                                  </div>
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                          <Button variant="outline" icon={<Download size={18} />} className="flex-1">
                            Download Invoice
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Need Help?
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}