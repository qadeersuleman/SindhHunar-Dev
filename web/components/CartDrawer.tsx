'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    t,
    isRTL,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartCount,
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#800000', '#C5A059', '#002366', '#ffffff'],
        });
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(false);
    }, 300);
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#C5A059]/20"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-bebas text-[#1A1A1A] leading-tight">
                    {t.cart.title}
                  </h2>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {cartCount} {t.cart.itemsCount}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {orderComplete ? (
                // Success State
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-bebas text-[#1A1A1A]">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                    Khush Amdeed! Your order has been placed. Our artisan coordinator will call you to confirm dispatch.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#800000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#660000]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : isCheckingOut ? (
                // Checkout Form
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider">
                      Delivery Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      Back to Cart
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Qadeer Suleman"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City in Pakistan *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="e.g. Ghotki, Sukkur, Karachi, Lahore"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Complete Shipping Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House / Flat #, Street, Mohalla / Area"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none resize-none"
                    />
                  </div>

                  {/* Payment Method Option */}
                  <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#C5A059]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#800000]" />
                      <span className="text-xs font-bold text-[#1A1A1A]">Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                      Free Shipping
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-4"
                  >
                    {isSubmitting ? 'Confirming Order...' : `Confirm Order (Rs. ${cartSubtotal.toLocaleString()})`}
                  </button>
                </form>
              ) : cart.length === 0 ? (
                // Empty Cart State
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-bebas text-[#1A1A1A]">
                    {t.cart.emptyTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    {t.cart.emptyDesc}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2 rounded-full bg-[#800000] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#660000] cursor-pointer"
                  >
                    {t.cart.explore}
                  </button>
                </div>
              ) : (
                // Cart Items List
                <div className="space-y-4">
                  {cart.map((item) => {
                    const img = Array.isArray(item.product.images) && item.product.images.length > 0
                      ? item.product.images[0]
                      : typeof item.product.images === 'string'
                      ? item.product.images
                      : '/images/AjrakBG.jpg';

                    return (
                      <div
                        key={item.product.id}
                        className="flex gap-3 p-3 bg-[#FAF9F6] rounded-2xl border border-gray-100 items-center justify-between"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={img}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 px-1">
                          <h4 className="text-xs font-bold text-[#1A1A1A] truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-[#800000] font-bebas block mt-0.5">
                            Rs. {Number(item.product.price).toLocaleString()}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Subtotal & Checkout Button */}
            {!isCheckingOut && !orderComplete && cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-[#FAF9F6]">
                <div className="space-y-2 mb-4 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-semibold text-gray-800">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cart.shipping}</span>
                    <span className="font-semibold text-emerald-600">
                      {t.cart.freeShipping}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-[#1A1A1A]">
                    <span>{t.cart.total}</span>
                    <span className="text-lg font-bebas text-[#800000]">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.cart.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
