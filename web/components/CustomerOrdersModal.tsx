'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { fetchLiveOrders, Order } from '@/lib/services';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

export const CustomerOrdersModal: React.FC = () => {
  const { isOrdersModalOpen, setIsOrdersModalOpen } = useApp();
  const { user, profile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOrdersModalOpen) return;

    async function loadOrders() {
      setLoading(true);
      try {
        const { orders: data } = await fetchLiveOrders({
          customerId: user?.id,
        });
        setOrders(data || []);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isOrdersModalOpen, user]);

  if (!isOrdersModalOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#002366]/10 text-[#002366] flex items-center gap-1"><Clock className="w-3 h-3" /> Confirmed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOrdersModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 z-10 max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#800000] text-white flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                  My Orders & Craft Shipments
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {user ? profile?.email || user.email : 'Guest / All Active Orders'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOrdersModalOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <span className="w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs">Loading orders from Supabase...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-base font-bold font-bebas text-gray-700">No Orders Placed Yet</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Your order history will appear here once you purchase an authentic craft from the Sindh Hunar Bazaar.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs hover:border-[#C5A059]/60 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Order ID</span>
                      <span className="text-xs font-mono font-bold text-[#800000]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-3 space-y-1.5">
                    {Array.isArray(order.items) &&
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-500 font-mono">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-2.5 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500 text-[11px]">
                      Delivering to: <span className="font-semibold text-gray-700">{order.shipping_address?.city || 'Pakistan'}</span>
                    </span>
                    <span className="font-bold text-[#800000] font-bebas text-sm">
                      Total: Rs. {order.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
