'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Filter,
  ArrowLeft,
  X,
  Upload,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { animeProducts } from '@/data/products';
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
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: 899,
    originalPrice: 1299,
    animeSeries: '',
    category: 'oversized',
    gsm: 240,
    stockLeft: 20,
    frontImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    backImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80',
    description: '240 GSM heavy combed cotton oversized streetwear tee with high-density print.',
  });
  const [savingProduct, setSavingProduct] = useState(false);

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
    fetchOrders();
  }, []);

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

  // Add new product to Supabase
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const slug =
        newProduct.slug ||
        newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const { data, error } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          slug: slug,
          price: Number(newProduct.price),
          original_price: Number(newProduct.originalPrice),
          anime_series: newProduct.animeSeries,
          category: newProduct.category,
          gsm: Number(newProduct.gsm),
          stock_left: Number(newProduct.stockLeft),
          front_image: newProduct.frontImage,
          back_image: newProduct.backImage,
          description: newProduct.description,
          in_stock: true,
        },
      ]);

      if (error) {
        alert('Could not save to Supabase: ' + error.message + '\n(Make sure the products table exists in your SQL editor).');
      } else {
        alert('🎉 New T-Shirt Drop added successfully!');
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
            Manage incoming orders, dispatch tracking, customer WhatsApp links, and Drop 01 inventory.
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
          <span>T-Shirt Inventory</span>
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
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                              order.payment_method === 'COD'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animeProducts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-3 flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.frontImage} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                      {p.animeSeries}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-950 font-mono line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-xs font-mono font-bold text-zinc-900 mt-1">₹{p.price}</p>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      Weight: {p.gsm} GSM • {p.fit}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Stock Available:</span>
                  <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-lg border border-zinc-200/80">
                    {p.stockLeft} Pieces
                  </span>
                </div>

                <Link
                  href={`/products/${p.slug}`}
                  className="w-full py-2.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200 font-bold text-xs font-mono text-center transition-all shadow-2xs"
                >
                  View Product Page
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW T-SHIRT DROP */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setIsAddProductOpen(false)}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md"
          />

          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-3xl border border-white shadow-2xl rounded-3xl p-6 sm:p-8 z-10 text-zinc-900 my-8">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">
                  NEW DROP ADDITION
                </span>
                <h3 className="text-2xl font-black text-zinc-950 font-mono">
                  ADD ANIME T-SHIRT
                </h3>
                <p className="text-xs text-zinc-500">
                  Fill in design details to list this T-shirt in your store.
                </p>
              </div>

              <div className="space-y-3 pt-2">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none"
                  />
                </div>

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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Price in ₹ (INR) *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="899"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none"
                    />
                  </div>
                </div>

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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Initial Stock Left *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="25"
                      value={newProduct.stockLeft}
                      onChange={(e) => setNewProduct({ ...newProduct, stockLeft: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Front Mockup Image URL *
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://..."
                    value={newProduct.frontImage}
                    onChange={(e) => setNewProduct({ ...newProduct, frontImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Back Manga Art Image URL *
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://..."
                    value={newProduct.backImage}
                    onChange={(e) => setNewProduct({ ...newProduct, backImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProduct}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs sm:text-sm font-mono tracking-wide hover:bg-zinc-850 transition-all cursor-pointer shadow-md disabled:opacity-70 mt-2"
              >
                {savingProduct ? 'SAVING TO SUPABASE...' : 'SAVE & LIST IN STORE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
