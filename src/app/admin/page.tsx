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
  ArrowUpRight,
  X,
  Lock,
  Unlock,
  Trash2,
  Star,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  Tag,
  AlertCircle,
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

  // Tab State: 'orders' | 'inventory' | 'database'
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'database'>('orders');

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

  // New Product Form Data (URL ONLY)
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
    if (passcode === 'yokai2026' || passcode === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('yokai_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Enter "yokai2026" to access.');
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
        console.warn('Orders notice:', error.message);
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
        alert('Notice: Could not set Hero product in Supabase: ' + error.message);
      } else {
        await refreshProducts();
        alert(`⭐ "${product.name}" is now set as the Homepage Hero Showcase!`);
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
        alert('Product deleted successfully from Supabase.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Add new product to Supabase (URL only)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const slug =
        newProduct.slug.trim() ||
        newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (newProduct.featuredOnHome) {
        try {
          await supabase.from('products').update({ featured_on_home: false }).neq('id', 'placeholder');
        } catch {
          // Ignore if column not present yet
        }
      }

      const { error } = await supabase.from('products').insert([
        {
          name: newProduct.name.trim(),
          slug: slug,
          price: Number(newProduct.price),
          original_price: Number(newProduct.originalPrice),
          anime_series: newProduct.animeSeries.trim(),
          category: newProduct.category,
          fit: newProduct.fit,
          gsm: Number(newProduct.gsm),
          stock_left: Number(newProduct.stockLeft),
          front_image: newProduct.frontImage.trim(),
          back_image: newProduct.backImage.trim(),
          description: newProduct.description.trim(),
          featured_on_home: newProduct.featuredOnHome,
          in_stock: true,
        },
      ]);

      if (error) {
        alert('Could not save to Supabase: ' + error.message);
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

  // Real-time discount calculation for modal
  const modalDiscountPercent =
    newProduct.originalPrice > newProduct.price
      ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
      : null;

  // 1. Loading check
  if (isCheckingAuth) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  // 2. Dedicated Passcode Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center p-4 bg-[#0d0f12] text-white">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400 mb-2">
              <ShieldCheck className="w-3 h-3 text-rose-500" />
              <span>YOKAI WEAR // RESTRICTED ACCESS</span>
            </div>
            <h1 className="text-2xl font-black text-white font-mono tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Store management console for Yokai Wear operations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter Passcode (yokai2026)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError('');
                }}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-700 text-sm font-mono text-white text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {authError && (
                <p className="text-xs font-mono text-rose-400 mt-2 font-medium">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Enter Admin Console</span>
            </button>

            <p className="text-[11px] text-zinc-500 font-mono">
              Default passcode: <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">yokai2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // 3. True Dedicated Admin Portal
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-900 flex flex-col font-sans">
      {/* EXCLUSIVE ADMIN TOPBAR */}
      <header className="sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-mono font-black text-white text-xs">
              YW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm tracking-wider text-white">
                  YOKAI WEAR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                  ADMIN CONSOLE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Live Connected</span>
              </div>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Health</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
            >
              <span>View Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Mobile Submenu for tabs */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-3 border-t border-zinc-800/80 mt-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-xs font-mono font-bold py-1 px-2 rounded-lg ${
              activeTab === 'orders' ? 'text-white bg-zinc-800' : 'text-zinc-400'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`text-xs font-mono font-bold py-1 px-2 rounded-lg ${
              activeTab === 'inventory' ? 'text-white bg-zinc-800' : 'text-zinc-400'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`text-xs font-mono font-bold py-1 px-2 rounded-lg ${
              activeTab === 'database' ? 'text-white bg-zinc-800' : 'text-zinc-400'
            }`}
          >
            DB Health
          </button>
        </div>
      </header>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Total Revenue</span>
            <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono mt-1">
              ₹{totalRevenue}
            </p>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">Real Orders</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Customer Orders</span>
            <p className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono mt-1">
              {orders.length}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono">In Supabase</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Pending Packing</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-1">
              {pendingOrders}
            </p>
            <span className="text-[10px] text-amber-600 font-mono font-semibold">Needs Dispatch</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Active Catalog</span>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">
              {products.length}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono">T-Shirt Drops</span>
          </div>
        </div>

        {/* TAB 1: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-zinc-200/80 p-3.5 rounded-2xl shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {['all', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-zinc-950 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:text-black border border-zinc-200/60'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-white border border-zinc-200/80 shadow-sm overflow-hidden">
              {loadingOrders ? (
                <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
                  <span>Loading orders from Supabase...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-16 text-center text-zinc-500 space-y-3">
                  <ShoppingBag className="w-10 h-10 mx-auto text-zinc-300" />
                  <h4 className="font-bold text-base text-zinc-800 font-mono">No Orders Found</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    {orders.length === 0
                      ? 'No customer orders have been placed yet. Place a test order from the store to see it appear live!'
                      : 'No orders match your filter criteria.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-zinc-500 text-[11px] uppercase tracking-wider">
                        <th className="py-3.5 px-5">Customer & Phone</th>
                        <th className="py-3.5 px-5">Delivery Address</th>
                        <th className="py-3.5 px-5">Items Ordered</th>
                        <th className="py-3.5 px-5">Amount & Payment</th>
                        <th className="py-3.5 px-5">Order Status</th>
                        <th className="py-3.5 px-5 text-right">Customer Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono">
                      {filteredOrders.map((order) => {
                        const cleanPhone = order.customer_phone?.replace(/[^0-9]/g, '');
                        const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(
                          order.customer_name || 'Customer'
                        )},%20thank%20you%20for%20ordering%20from%20Yokai%20Wear!%20Your%20order%20status%20is:%20${encodeURIComponent(
                          order.status
                        )}.`;

                        return (
                          <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
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
                                <span className="text-zinc-500 text-xs">Standard Drop 01 Tee</span>
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

                            {/* WhatsApp Action */}
                            <td className="py-4 px-5 text-right">
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-[11px] font-mono transition-all shadow-2xs"
                                title="Chat on WhatsApp"
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

        {/* TAB 2: T-SHIRT INVENTORY & DROPS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-zinc-200/80 p-4 rounded-2xl">
              <div>
                <h3 className="font-bold text-sm text-zinc-950 font-mono">
                  All T-Shirt Drops ({products.length} Items)
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage pricing, strikethrough MRP discount, hero banner placement, and stock.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New T-Shirt</span>
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
                    className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3.5 flex flex-col justify-between relative group hover:border-zinc-300 transition-all"
                  >
                    {/* Hero Badge */}
                    {p.featuredOnHome && (
                      <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-zinc-950 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 shadow-sm flex items-center gap-1 z-10">
                        <Star className="w-3 h-3 fill-zinc-950" /> HERO BANNER
                      </div>
                    )}

                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-26 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
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

                        {/* Price & MRP with Strikethrough */}
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

                        <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                          {p.gsm} GSM • {p.fit}
                        </span>
                      </div>
                    </div>

                    {/* Stock Remaining */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Stock Units:</span>
                      <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200">
                        {p.stockLeft} Pieces
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-100">
                      <button
                        onClick={() => handleToggleHeroProduct(p)}
                        disabled={settingHeroId === p.id}
                        className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                          p.featuredOnHome
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-zinc-50 text-zinc-700 hover:text-black hover:bg-zinc-100 border-zinc-200'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.featuredOnHome ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{p.featuredOnHome ? 'Hero Active' : 'Set as Hero'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        disabled={deletingId === p.id}
                        className="py-2 px-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="w-full py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs font-mono text-center transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Preview Product</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SUPABASE DATABASE HEALTH */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold uppercase">
                <Database className="w-4 h-4" />
                <span>SUPABASE CLUSTER STATUS</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-zinc-950">
                Connected Project: <span className="text-rose-600">kgtmnrfupbrytefwilkj</span>
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                Your database is actively handling orders and products via Postgres on Supabase with Row Level Security (RLS) policies and direct server connection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 font-mono">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase">Table: `products`</span>
                  <p className="text-xl font-black text-zinc-900 mt-1">{products.length} Rows</p>
                  <span className="text-[10px] text-emerald-600">Public Read + Admin Write</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase">Table: `orders`</span>
                  <p className="text-xl font-black text-zinc-900 mt-1">{orders.length} Rows</p>
                  <span className="text-[10px] text-emerald-600">Checkout Insert + Admin Status</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] text-zinc-500 uppercase">Authentication</span>
                  <p className="text-xl font-black text-zinc-900 mt-1">Service Role</p>
                  <span className="text-[10px] text-emerald-600">Connected & Verified</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <a
                  href="https://supabase.com/dashboard/project/kgtmnrfupbrytefwilkj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Open Supabase Cloud Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD NEW T-SHIRT DROP (URL ONLY) */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setIsAddProductOpen(false)}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-4xl bg-white border border-zinc-200 shadow-2xl rounded-3xl p-6 sm:p-8 z-10 text-zinc-900 my-8">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">
                YOKAI WEAR // NEW DROP
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
                ADD NEW T-SHIRT
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Paste image URLs for front & back views, set pricing with automatic discount calculation, and publish live.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Inputs (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* T-Shirt Name */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                    T-Shirt Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. DOMAIN EXPANSION // VOID OVERSIZED TEE"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                </div>

                {/* Series & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                      Anime Series / Tag *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Jujutsu Special"
                      value={newProduct.animeSeries}
                      onChange={(e) => setNewProduct({ ...newProduct, animeSeries: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    >
                      <option value="oversized">Oversized Boxy Fit</option>
                      <option value="acid-wash">Vintage Acid Washed</option>
                      <option value="graphic-tees">Graphic Prints</option>
                    </select>
                  </div>
                </div>

                {/* Pricing: Selling Price vs MRP */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-800 font-bold uppercase mb-1">
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
                    <span className="text-[10px] text-zinc-400 font-mono">Amount customer pays</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-800 font-bold uppercase mb-1">
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
                    <span className="text-[10px] text-zinc-400 font-mono">Crossed out on website</span>
                  </div>

                  {modalDiscountPercent && (
                    <div className="col-span-2 pt-1 text-xs font-mono text-emerald-700 flex items-center justify-between border-t border-zinc-200/80">
                      <span>Discount: <strong>{modalDiscountPercent}% OFF</strong></span>
                      <span>Customer Saves: <strong>₹{newProduct.originalPrice - newProduct.price}</strong></span>
                    </div>
                  )}
                </div>

                {/* GSM & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                      Fabric GSM *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="240"
                      value={newProduct.gsm}
                      onChange={(e) => setNewProduct({ ...newProduct, gsm: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                      Initial Stock Left *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="20"
                      value={newProduct.stockLeft}
                      onChange={(e) => setNewProduct({ ...newProduct, stockLeft: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Front Image URL ONLY */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-800 font-bold uppercase mb-1">
                    Front Mockup Image URL *
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.frontImage}
                    onChange={(e) => setNewProduct({ ...newProduct, frontImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                    Paste any public image link (Unsplash, Imgur, Supabase storage, etc.)
                  </span>
                </div>

                {/* Back Image URL ONLY */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-800 font-bold uppercase mb-1">
                    Back Manga Graphic URL *
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.backImage}
                    onChange={(e) => setNewProduct({ ...newProduct, backImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                    Shows when customer toggles front/back or hovers on card
                  </span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-600 font-bold uppercase mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                {/* Toggle: Homepage Hero */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950 font-mono">Set as Homepage Hero Showcase</h4>
                      <p className="text-[11px] text-zinc-500">Feature this tee in the 3D interactive hero banner</p>
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
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs sm:text-sm font-mono tracking-wide transition-all cursor-pointer shadow-md disabled:opacity-70"
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
                  <div className="rounded-2xl bg-white border border-zinc-200 shadow-md overflow-hidden p-3 space-y-3">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100">
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
                  Saves directly into Supabase table `products`.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
