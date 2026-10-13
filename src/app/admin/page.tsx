'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Phone,
  MessageCircle,
  RefreshCw,
  Search,
  Plus,
  Eye,
  ArrowLeft,
  X,
  Upload,
  Lock,
  Unlock,
  Trash2,
  Star,
  Layers,
  Sparkles,
  Flame,
  Check,
  ImageIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';

interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  status: 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export default function AdminDashboardPage() {
  // Passcode Protection state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Products from Context
  const { products, refreshProducts } = useProducts();

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [previewFlip, setPreviewFlip] = useState<'front' | 'back'>('front');
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingHeroId, setSettingHeroId] = useState<string | null>(null);

  // New Product Form Data
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: 899,
    originalPrice: 1499,
    animeSeries: 'Jujutsu Special',
    category: 'oversized' as 'oversized' | 'acid-wash' | 'graphic-tees',
    fit: 'Oversized Boxy Fit',
    gsm: 240,
    stockLeft: 20,
    featuredOnHome: false,
    frontImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop&q=80',
    backImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    description: '240 GSM heavy combed cotton oversized streetwear tee with high-density anime manga print.',
  });

  // Check existing session
  useEffect(() => {
    const saved = sessionStorage.getItem('yokai_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Admin PIN: yokai2026 or 1234
    if (passcode === 'yokai2026' || passcode === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('yokai_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('yokai_admin_auth');
    setPasscode('');
  };

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Orders query notice:', error.message);
      } else if (data) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.warn('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Update order status live in Supabase
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Image File Upload (convert to base64 Data URL)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'front') {
            setNewProduct((prev) => ({ ...prev, frontImage: reader.result as string }));
          } else {
            setNewProduct((prev) => ({ ...prev, backImage: reader.result as string }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Featured on Home Screen
  const handleToggleHeroProduct = async (product: Product) => {
    setSettingHeroId(product.id);
    try {
      // First unfeature all products
      await supabase.from('products').update({ featured_on_home: false }).neq('id', 'placeholder');

      // Then set this product as featured
      const newStatus = !product.featuredOnHome;
      const { error } = await supabase
        .from('products')
        .update({ featured_on_home: newStatus })
        .eq('id', product.id);

      if (error) {
        alert('Notice: Could not set Hero product in Supabase. Check if column exists: ' + error.message);
      } else {
        await refreshProducts();
        alert(`🎉 "${product.name}" is now featured on the Homepage Hero!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingHeroId(null);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from the store?`)) {
      return;
    }
    setDeletingId(productId);
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        alert('Failed to delete: ' + error.message);
      } else {
        await refreshProducts();
        alert('Product deleted successfully.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Add new product to Supabase
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const slug =
        newProduct.slug.trim() ||
        newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // If marked as featured on home, unfeature others
      if (newProduct.featuredOnHome) {
        try {
          await supabase.from('products').update({ featured_on_home: false }).neq('id', 'placeholder');
        } catch {
          // Ignore if column not present yet
        }
      }

      const { error } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          slug: slug,
          price: Number(newProduct.price),
          original_price: Number(newProduct.originalPrice),
          anime_series: newProduct.animeSeries,
          category: newProduct.category,
          fit: newProduct.fit,
          gsm: Number(newProduct.gsm),
          stock_left: Number(newProduct.stockLeft),
          front_image: newProduct.frontImage,
          back_image: newProduct.backImage,
          description: newProduct.description,
          featured_on_home: newProduct.featuredOnHome,
          in_stock: true,
        },
      ]);

      if (error) {
        alert('Could not save to Supabase: ' + error.message + '\n\nMake sure you ran the SQL setup in your Supabase SQL Editor.');
      } else {
        await refreshProducts();
        alert('🎉 New T-Shirt Drop published live to the store!');
        setIsAddProductOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProduct(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(query) ||
      order.customer_phone?.includes(query) ||
      order.city?.toLowerCase().includes(query) ||
      order.id?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? Number(o.total_amount) : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const dispatchedOrders = orders.filter((o) => o.status === 'Dispatched').length;

  // Real-time discount calculation for new product modal
  const modalDiscountPercent =
    newProduct.originalPrice > newProduct.price
      ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
      : null;

  // 1. Loading check
  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  // 2. Passcode Gate Screen
  if (!isAuthenticated) {
    return (
      <main className="flex-1 w-full flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold text-rose-600 uppercase tracking-widest">
              YOKAI WEAR // ADMIN ACCESS
            </span>
            <h1 className="text-2xl font-black text-zinc-950 font-mono mt-1">
              Store Owner Portal
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your admin security passcode to manage orders, update dispatch status, and publish new t-shirt drops.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter Admin Passcode (Default: yokai2026)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError('');
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-zinc-200 text-sm font-mono text-zinc-900 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-zinc-950 shadow-inner"
              />
              {authError && (
                <p className="text-xs font-mono text-rose-600 mt-2 font-medium">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>

            <p className="text-[10px] text-zinc-400 font-mono">
              Default passcode: <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">yokai2026</code>
            </p>
          </form>
        </div>
      </main>
    );
  }

  // 3. Authenticated Dashboard Screen
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-mono text-xs tracking-wider uppercase mb-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>YOKAI WEAR // STORE ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 font-mono tracking-tight">
            MANAGEMENT DASHBOARD
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Manage incoming orders, dispatch tracking, WhatsApp customer links, and Drop 01 inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-white text-zinc-700 hover:text-black font-semibold text-xs font-mono transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View Live Store
          </Link>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-2xl bg-white/80 hover:bg-white border border-white text-zinc-700 hover:text-black shadow-2xs transition-all cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs font-mono transition-all shadow-2xs cursor-pointer"
            title="Lock Dashboard"
          >
            Lock
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md shadow-zinc-900/[0.02]">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Total Revenue</span>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono mt-1">
            ₹{totalRevenue}
          </p>
          <span className="text-[10px] text-emerald-600 font-mono font-semibold">Active Orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md shadow-zinc-900/[0.02]">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Total Orders</span>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono mt-1">
            {orders.length}
          </p>
          <span className="text-[10px] text-zinc-500 font-mono">All Time</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md shadow-zinc-900/[0.02]">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Pending Dispatch</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-1">
            {pendingOrders}
          </p>
          <span className="text-[10px] text-amber-600 font-mono font-semibold">Needs Packing</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md shadow-zinc-900/[0.02]">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Out for Delivery</span>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 font-mono mt-1">
            {dispatchedOrders}
          </p>
          <span className="text-[10px] text-blue-600 font-mono font-semibold">In Transit</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-200/60 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white/70 text-zinc-600 hover:text-black border border-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders List ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white/70 text-zinc-600 hover:text-black border border-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>T-Shirt Inventory ({products.length})</span>
        </button>

        {activeTab === 'inventory' && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="ml-auto px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Drop
          </button>
        )}
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 backdrop-blur-xl border border-white p-3.5 rounded-2xl shadow-xs">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-200/80 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['all', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-zinc-900 text-white'
                      : 'bg-white text-zinc-600 hover:text-black border border-zinc-200/70'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-zinc-900/[0.03] overflow-hidden">
            {loadingOrders ? (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
                <span>Loading live orders from Supabase...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-16 text-center text-zinc-500 space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-zinc-300" />
                <h4 className="font-bold text-base text-zinc-800 font-mono">No Orders Found</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {orders.length === 0
                    ? 'No customer orders have been placed yet. Test an order from the store to see it appear here live!'
                    : 'No orders match your filter criteria.'}
                </p>
                {orders.length === 0 && (
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-850"
                  >
                    Place a Test Order
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200/60 bg-white/80 font-mono text-zinc-500 text-[11px] uppercase tracking-wider">
                      <th className="py-4 px-5">Customer & Phone</th>
                      <th className="py-4 px-5">Delivery Address</th>
                      <th className="py-4 px-5">Items Ordered</th>
                      <th className="py-4 px-5">Amount & Payment</th>
                      <th className="py-4 px-5">Current Status</th>
                      <th className="py-4 px-5 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-mono">
                    {filteredOrders.map((order) => {
                      const cleanPhone = order.customer_phone?.replace(/[^0-9]/g, '');
                      const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(
                        order.customer_name || 'Customer'
                      )},%20thank%20you%20for%20your%20order%20at%20Yokai%20Wear!%20Your%20order%20is%20${encodeURIComponent(
                        order.status
                      )}.`;

                      return (
                        <tr key={order.id} className="hover:bg-white/80 transition-colors">
                          {/* Customer */}
                          <td className="py-4 px-5">
                            <span className="font-bold text-zinc-950 text-sm block">
                              {order.customer_name}
                            </span>
                            <span className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-zinc-400" /> {order.customer_phone}
                            </span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>

                          {/* Address */}
                          <td className="py-4 px-5 max-w-xs">
                            <span className="text-zinc-700 block leading-relaxed line-clamp-2">
                              {order.shipping_address}
                            </span>
                            <span className="text-zinc-900 font-bold text-[11px] block mt-0.5">
                              {order.city}, {order.pincode}
                            </span>
                          </td>

                          {/* Items */}
                          <td className="py-4 px-5">
                            {order.order_items && order.order_items.length > 0 ? (
                              <div className="space-y-1">
                                {order.order_items.map((it, idx) => (
                                  <div key={idx} className="text-zinc-800 text-[11px]">
                                    <span className="font-semibold">{it.product_name}</span>{' '}
                                    <span className="text-zinc-500">
                                      ({it.size} • {it.color} × {it.quantity})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-400 text-xs italic">Drop 01 Item</span>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-5">
                            <span className="text-sm font-black text-zinc-950 block">
                              ₹{order.total_amount}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                                order.payment_method === 'COD'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online UPI'}
                            </span>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-4 px-5">
                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono focus:outline-none cursor-pointer border shadow-2xs ${
                                order.status === 'Confirmed'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : order.status === 'Dispatched'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <option value="Confirmed">Confirmed (Pending)</option>
                              <option value="Dispatched">Dispatched (Shipped)</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Quick Actions (WhatsApp) */}
                          <td className="py-4 px-5 text-right">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-[11px] font-mono transition-all shadow-2xs"
                              title="Message Customer on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 font-mono">Catalog T-Shirts ({products.length})</h3>
              <p className="text-xs text-zinc-500">
                Manage live drops, discount pricing, home hero showcase, and product availability.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New T-Shirt
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const discountPercent =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-3.5 flex flex-col justify-between relative group hover:shadow-xl transition-all"
                >
                  {/* Home Hero Indicator */}
                  {p.featuredOnHome && (
                    <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-zinc-950 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-zinc-950" /> HERO SHOWCASE
                    </div>
                  )}

                  {/* Thumbnail and Title */}
                  <div className="flex gap-4">
                    <div className="relative w-20 h-26 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.frontImage} alt={p.name} className="w-full h-full object-cover" />
                      {discountPercent && (
                        <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-mono font-black px-1 rounded">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                        {p.animeSeries}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-950 font-mono line-clamp-1 mt-0.5">
                        {p.name}
                      </h4>

                      {/* Pricing with strikethrough */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-zinc-950 font-mono">
                          ₹{p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through font-mono">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                        {p.gsm} GSM • {p.fit}
                      </span>
                    </div>
                  </div>

                  {/* Stock Availability */}
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Stock Remaining:</span>
                    <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-lg border border-zinc-200/80">
                      {p.stockLeft} Pieces
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-200/60">
                    <button
                      onClick={() => handleToggleHeroProduct(p)}
                      disabled={settingHeroId === p.id}
                      className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                        p.featuredOnHome
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.featuredOnHome ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{p.featuredOnHome ? 'Hero Active' : 'Set as Hero'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="py-2 px-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <Link
                    href={`/products/${p.slug}`}
                    className="w-full py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs font-mono text-center transition-all shadow-2xs"
                  >
                    View Product Page
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW T-SHIRT DROP */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setIsAddProductOpen(false)}
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-md"
          />

          <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-3xl border border-white shadow-2xl rounded-3xl p-6 sm:p-8 z-10 text-zinc-900 my-8">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">
                NEW DROP CREATOR
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
                ADD NEW ANIME T-SHIRT
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Upload front and back mockups, set selling price and MRP with strikethrough discount, and optionally set as the homepage hero.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Inputs (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    T-Shirt Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. DOMAIN EXPANSION // VOID TEE"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Anime Series & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Anime Series / Tag *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Jujutsu Special"
                      value={newProduct.animeSeries}
                      onChange={(e) => setNewProduct({ ...newProduct, animeSeries: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    >
                      <option value="oversized">Oversized Boxy Fit</option>
                      <option value="acid-wash">Vintage Acid Washed</option>
                      <option value="graphic-tees">Graphic Prints</option>
                    </select>
                  </div>
                </div>

                {/* Pricing: Selling Price vs MRP Original Price */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-700 font-bold uppercase mb-1">
                      Selling Price ₹ (Offer Price) *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="899"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-mono text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      MRP / Original Price ₹ (Strike Line) *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="1499"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-mono text-zinc-900 focus:outline-none"
                    />
                  </div>

                  {modalDiscountPercent && (
                    <div className="col-span-2 pt-1 text-xs font-mono text-emerald-700 flex items-center justify-between">
                      <span>Discount: <strong>{modalDiscountPercent}% OFF</strong></span>
                      <span>Customer Saves: <strong>₹{newProduct.originalPrice - newProduct.price}</strong></span>
                    </div>
                  )}
                </div>

                {/* GSM & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Fabric GSM *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="240"
                      value={newProduct.gsm}
                      onChange={(e) => setNewProduct({ ...newProduct, gsm: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Initial Stock Left *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="20"
                      value={newProduct.stockLeft}
                      onChange={(e) => setNewProduct({ ...newProduct, stockLeft: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image 1: Main Front Image (Card Image) */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono text-zinc-700 font-bold uppercase">
                      Front View Image (Main Card Image) *
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Upload file OR enter URL</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image link: https://..."
                      value={newProduct.frontImage.startsWith('data:') ? 'Image uploaded from device' : newProduct.frontImage}
                      onChange={(e) => setNewProduct({ ...newProduct, frontImage: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                    <label className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'front')}
                      />
                    </label>
                  </div>
                </div>

                {/* Image 2: Sub Image (Back Graphic / Manga Print) */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono text-zinc-700 font-bold uppercase">
                      Back Manga Graphic Image (Sub Card Image) *
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Upload file OR enter URL</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image link: https://..."
                      value={newProduct.backImage.startsWith('data:') ? 'Image uploaded from device' : newProduct.backImage}
                      onChange={(e) => setNewProduct({ ...newProduct, backImage: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                    <label className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'back')}
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                {/* Toggle: Hero on Homepage */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950 font-mono">Showcase in Homepage Hero</h4>
                      <p className="text-[11px] text-zinc-500">Feature this design in the interactive 3D top hero banner</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={newProduct.featuredOnHome}
                    onChange={(e) => setNewProduct({ ...newProduct, featuredOnHome: e.target.checked })}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs sm:text-sm font-mono tracking-wide hover:bg-zinc-850 transition-all cursor-pointer shadow-md disabled:opacity-70"
                >
                  {savingProduct ? 'SAVING TO SUPABASE...' : 'PUBLISH & LIST IN STORE'}
                </button>
              </div>

              {/* Right Column: Live Card Preview (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold">
                      LIVE CARD PREVIEW
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewFlip(previewFlip === 'front' ? 'back' : 'front')}
                      className="text-[10px] font-mono bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded-md text-zinc-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3 h-3 text-rose-500" />
                      <span>Flip to {previewFlip === 'front' ? 'Back' : 'Front'}</span>
                    </button>
                  </div>

                  {/* Simulated Product Card */}
                  <div className="rounded-3xl bg-white border border-zinc-200 shadow-xl overflow-hidden p-3 space-y-3">
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewFlip === 'front' ? newProduct.frontImage : newProduct.backImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {modalDiscountPercent && (
                          <span className="bg-emerald-500 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-full w-max shadow-xs">
                            {modalDiscountPercent}% OFF
                          </span>
                        )}
                        <span className="bg-white/90 backdrop-blur-md text-zinc-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full w-max shadow-xs">
                          {newProduct.gsm} GSM
                        </span>
                      </div>

                      {/* Scarcity badge */}
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="text-[9px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full shadow-xs border border-rose-200">
                          Only {newProduct.stockLeft} left
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">
                        {newProduct.animeSeries || 'Anime Series'}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-950 font-mono line-clamp-1">
                        {newProduct.name || 'T-Shirt Name'}
                      </h4>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-black text-zinc-950 font-mono">
                          ₹{newProduct.price}
                        </span>
                        {newProduct.originalPrice > newProduct.price && (
                          <span className="text-xs text-zinc-400 line-through font-mono">
                            ₹{newProduct.originalPrice}
                          </span>
                        )}
                        {modalDiscountPercent && (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 ml-auto">
                            Save ₹{newProduct.originalPrice - newProduct.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 font-mono text-center mt-4">
                  Changes save directly to Supabase and update the website instantly.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
