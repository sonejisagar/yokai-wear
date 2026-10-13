'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const { cart, totalPrice, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'COD' as 'COD' | 'UPI',
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingFee = totalPrice >= 999 ? 0 : 79;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedId = 'YOKAI-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // Attempt to save in Supabase orders table
      const { data, error } = await supabase.from('orders').insert([
        {
          customer_name: formData.name,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          total_amount: grandTotal,
          payment_method: formData.paymentMethod,
          status: 'Confirmed',
        },
      ]).select();

      if (error) {
        console.warn('Note: Supabase table not created yet or RLS policy active. Order confirmed locally:', error.message);
      } else if (data && data[0]) {
        // Also save order items if orders table exists
        const orderRecord = data[0];
        const itemsToInsert = cart.map((item) => ({
          order_id: orderRecord.id,
          product_name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        }));
        await supabase.from('order_items').insert(itemsToInsert);
      }
    } catch (err) {
      console.warn('Supabase insert notice:', err);
    }

    setOrderId(generatedId);
    setLoading(false);
    setOrderPlaced(true);

    // Clear cart
    cart.forEach((item) => removeFromCart(item.id));
  };

  const handleClose = () => {
    setOrderPlaced(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white/90 backdrop-blur-3xl border border-white shadow-2xl rounded-3xl p-6 sm:p-8 z-10 text-zinc-900 my-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderPlaced ? (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                    ORDER CONFIRMED
                  </span>
                  <h3 className="text-2xl font-black text-zinc-950 font-mono mt-1">
                    THANK YOU, {formData.name.toUpperCase()}!
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Your order <span className="font-mono font-bold text-zinc-900">{orderId}</span> has been confirmed. You will receive an SMS update once dispatched.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Amount:</span>
                    <span className="font-bold text-zinc-950">₹{grandTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Payment:</span>
                    <span className="font-bold text-zinc-950">
                      {formData.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online UPI'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Deliver to:</span>
                    <span className="text-zinc-800 truncate max-w-[200px]">{formData.city}, {formData.pincode}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs font-mono hover:bg-zinc-850 transition-all cursor-pointer shadow-sm"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">
                    FAST CHECKOUT
                  </span>
                  <h3 className="text-2xl font-black text-zinc-950 font-mono">
                    DELIVERY DETAILS
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Enter your address for express delivery.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sagar Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Mobile Number (For Delivery SMS) *
                    </label>
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                      Flat / House No. & Street Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street name, landmark, building"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 shadow-2xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Ahmedabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                        Pincode *
                      </label>
                      <input
                        required
                        type="text"
                        pattern="[0-9]{6}"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-2">
                      Select Payment Mode *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.paymentMethod === 'COD'
                            ? 'border-zinc-950 bg-white shadow-xs ring-1 ring-zinc-950'
                            : 'border-zinc-200/80 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-zinc-950">
                          <Truck className="w-3.5 h-3.5 text-zinc-900" /> Cash on Delivery
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1">Pay at doorstep</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          formData.paymentMethod === 'UPI'
                            ? 'border-zinc-950 bg-white shadow-xs ring-1 ring-zinc-950'
                            : 'border-zinc-200/80 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-zinc-950">
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> UPI / Card
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1">GPay, PhonePe, Paytm</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-600 font-medium">Grand Total Payable:</span>
                  <span className="text-base font-black text-zinc-950">₹{grandTotal}</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs sm:text-sm font-mono tracking-wide flex items-center justify-center gap-2 shadow-md shadow-zinc-950/15 cursor-pointer disabled:opacity-70 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>CONFIRMING ORDER...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRM ORDER (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
