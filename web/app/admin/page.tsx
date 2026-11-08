'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useToast, useSweetAlert } from '@/components/ui/SweetAlertToast';
import {
  fetchLiveProducts,
  addProductRecord,
  deleteProductRecord,
  updateProductRecord,
  fetchAllProfiles,
  updateUserRoleInDb,
  upsertArtisanRecord,
  deleteArtisanRecord,
  fetchLiveOrders,
  updateOrderStatusInDb,
  fetchAllArtisans,
  UserProfile,
  Artisan,
  Order,
} from '@/lib/services';
import { Product } from '@/lib/supabase';
import {
  ShieldCheck,
  PlusCircle,
  Package,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Store,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SINDHI_CATEGORIES = [
  'Ajrak Printing',
  'Sindhi Topi',
  'Rilli Work',
  'Blue Pottery',
  'Mirror Work',
  'Block Printing',
  'Traditional Crafts',
];

export default function AdminDashboardPage() {
  const { user, profile, role, isAdmin, setDevRole } = useAuth();
  const { refreshProducts, setIsAuthModalOpen } = useApp();
  const toast = useToast();
  const sweetAlert = useSweetAlert();

  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'users' | 'orders' | 'artisans'>('products');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Ajrak Printing');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedArtisanId, setSelectedArtisanId] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Users State
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Artisan Modal State for Role Upgrade
  const [artisanModalUser, setArtisanModalUser] = useState<UserProfile | null>(null);
  const [artisanShopName, setArtisanShopName] = useState('');
  const [artisanSpecialty, setArtisanSpecialty] = useState('Ajrak & Block Printing');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Artisans State
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loadingArtisans, setLoadingArtisans] = useState(false);

  // 1. Load Products
  const loadAdminProducts = useCallback(async () => {
    setLoadingProducts(true);
    const { data } = await fetchLiveProducts();
    setProducts(data || []);
    setLoadingProducts(false);
  }, []);

  // 2. Load Users
  const loadAdminProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    const { profiles: data } = await fetchAllProfiles();
    setProfiles(data || []);
    setLoadingProfiles(false);
  }, []);

  // 3. Load Orders
  const loadAdminOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { orders: data } = await fetchLiveOrders();
    setOrders(data || []);
    setLoadingOrders(false);
  }, []);

  // 4. Load Artisans
  const loadAdminArtisans = useCallback(async () => {
    setLoadingArtisans(true);
    const { data } = await fetchAllArtisans();
    setArtisans(data || []);
    setLoadingArtisans(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminProducts();
      loadAdminProfiles();
      loadAdminOrders();
      loadAdminArtisans();
    }
  }, [isAdmin, loadAdminProducts, loadAdminProfiles, loadAdminOrders, loadAdminArtisans]);

  // Handle Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      toast.warning('Please enter craft name and price');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price in PKR');
      return;
    }

    setIsSubmittingProduct(true);

    try {
      // Use fallback image if none provided
      const finalImage =
        newImage.trim() ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop';

      const { data, error } = await addProductRecord({
        name: newTitle.trim(),
        price: priceNum,
        category: newCategory,
        description: newDescription.trim() || undefined,
        images: [finalImage],
        stock_quantity: parseInt(newStock, 10) || 10,
        is_available: true,
        artisan_id: selectedArtisanId || undefined,
        rating: 5.0,
      });

      if (error) {
        toast.error(error.message || 'Failed to add craft');
      } else {
        toast.success(`Craft "${newTitle}" published successfully!`, 'Hunar Added');
        sweetAlert.success(
          'Craft Published!',
          `"${newTitle}" has been added directly to your live Supabase database and is now visible on the main Bazaar.`
        );

        // Reset form
        setNewTitle('');
        setNewPrice('');
        setNewDescription('');
        setNewImage('');
        setNewStock('10');

        // Refresh live data
        await loadAdminProducts();
        await refreshProducts();
        setActiveTab('products');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (product: Product) => {
    const confirmed = await sweetAlert.confirm(
      `Delete "${product.name}"?`,
      'Are you sure you want to delete this craft from the database? This action is permanent.',
      { confirmButtonText: 'Yes, Delete', cancelButtonText: 'Cancel' }
    );

    if (!confirmed) return;

    const { error } = await deleteProductRecord(product.id);
    if (error) {
      toast.error(error.message || 'Failed to delete craft');
    } else {
      toast.success('Craft deleted from database');
      await loadAdminProducts();
      await refreshProducts();
    }
  };

  // Handle Toggle Availability
  const handleToggleAvailability = async (product: Product) => {
    const updatedStatus = !product.is_available;
    const { error } = await updateProductRecord(product.id, {
      is_available: updatedStatus,
    });

    if (error) {
      toast.error(error.message || 'Failed to update status');
    } else {
      toast.info(`Product marked as ${updatedStatus ? 'In Stock' : 'Out of Stock'}`);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: updatedStatus } : p))
      );
      await refreshProducts();
    }
  };

  // Handle Role Change for Users (matching Mobile 1:1)
  const handleUserRoleChange = async (targetUser: UserProfile, newRole: UserRole) => {
    if (targetUser.role === newRole) return;

    if (newRole === 'artisan') {
      // Prompt for Shop Details
      setArtisanModalUser(targetUser);
      setArtisanShopName(`${targetUser.name || 'Sindhi'}'s Craft House`);
      return;
    }

    const confirmed = await sweetAlert.confirm(
      `Change Role to ${newRole.toUpperCase()}?`,
      `Change role of ${targetUser.name || targetUser.email} from ${targetUser.role} to ${newRole}?`
    );

    if (!confirmed) return;

    const { error } = await updateUserRoleInDb(targetUser.id, newRole);

    // If downgraded from artisan, clean up artisan record (matching mobile)
    if (targetUser.role === 'artisan') {
      await deleteArtisanRecord(targetUser.id);
    }

    if (error) {
      toast.error(error.message || 'Failed to update role');
    } else {
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
      loadAdminProfiles();
      loadAdminArtisans();
    }
  };

  // Submit Artisan Upgrade Modal
  const handleArtisanModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisanModalUser || !artisanShopName.trim()) return;

    try {
      // 1. Update Profile role
      const { error: roleErr } = await updateUserRoleInDb(artisanModalUser.id, 'artisan');
      if (roleErr) throw roleErr;

      // 2. Upsert Artisan shop record
      const { error: artisanErr } = await upsertArtisanRecord({
        owner_id: artisanModalUser.id,
        shop_name: artisanShopName.trim(),
        specialty: artisanSpecialty.split(',').map((s) => s.trim()),
        rating: 5.0,
        is_active: true,
      });
      if (artisanErr) throw artisanErr;

      toast.success(`Artisan shop "${artisanShopName}" activated!`);
      sweetAlert.success('Artisan Registered!', `${artisanModalUser.name || artisanModalUser.email} is now an official Artisan.`);

      setArtisanModalUser(null);
      setArtisanShopName('');
      loadAdminProfiles();
      loadAdminArtisans();
    } catch (err: any) {
      toast.error(err.message || 'Error creating artisan');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (order: Order, newStatus: Order['status']) => {
    const confirmed = await sweetAlert.confirm(
      `Update Status to ${newStatus.toUpperCase()}?`,
      `Change Order #${order.id.slice(0, 8)} to "${newStatus}"?`
    );

    if (!confirmed) return;

    const { error } = await updateOrderStatusInDb(order.id, newStatus);
    if (error) {
      toast.error(error.message || 'Failed to update order status');
    } else {
      toast.success(`Order marked as ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
    }
  };

  // FILTERED PROFILES
  const filteredProfiles = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // IF NOT ADMIN: SHOW ACCESS RESTRICTED SCREEN WITH FAST ACCESS
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-[#C5A059]/40 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800000] via-[#C5A059] to-[#002366]" />

          <div className="w-16 h-16 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-bebas text-[#1A1A1A]">
            Admin Portal Access Restricted
          </h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            This dashboard is reserved for Sindh Hunar Administrators. Your current role is:{' '}
            <span className="font-bold uppercase text-[#800000]">[{role || 'Guest'}]</span>.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={async () => {
                await setDevRole('admin');
                toast.success('Admin privileges enabled!');
              }}
              className="w-full py-3 px-4 rounded-full bg-[#002366] hover:bg-[#001744] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Switch to Admin Mode (Instant)</span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3 px-4 rounded-full bg-white border border-[#800000] text-[#800000] hover:bg-[#800000]/5 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Sign In with Admin Account
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sindh Hunar Bazaar</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ADMIN PANEL
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white border-b border-[#C5A059]/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Brand & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all text-xs"
                title="Return to Bazaar"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Bazaar</span>
              </Link>

              <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-sm bg-white p-0.5">
                  <Image
                    src="/images/logo.png"
                    alt="Sindh Hunar Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-bebas text-white tracking-wide">
                      Sindh Hunar Admin
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-[#C5A059] text-gray-950 font-bold text-[9px] uppercase tracking-wider">
                      Master Portal
                    </span>
                  </div>
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase font-mono block">
                    Mehran Heritage CMS
                  </span>
                </div>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('add')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                <span className="hidden sm:inline">Add New Craft</span>
              </button>

              <div className="text-right hidden md:block">
                <span className="text-xs font-bold text-white block">
                  {profile?.name || user?.email}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Role: [ADMIN]</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#C5A059] text-gray-950 shadow-md'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Crafts ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-[#800000] text-white shadow-md border border-[#C5A059]'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#C5A059]" />
              <span>+ Add Craft</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#C5A059] text-gray-950 shadow-md'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Roles ({profiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#C5A059] text-gray-950 shadow-md'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('artisans')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'artisans'
                  ? 'bg-[#C5A059] text-gray-950 shadow-md'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Artisans ({artisans.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ========================================================= */}
        {/* TAB 1: ADD NEW CRAFT (SIMPLE DATA ENTRY - NO EXTRA THINGS) */}
        {/* ========================================================= */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800000] via-[#C5A059] to-[#002366]" />

              <div className="flex items-center gap-2 text-xs font-bold text-[#800000] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Simple & Creative Data Entry</span>
              </div>
              <h2 className="text-3xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                Add New Sindhi Craft
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill the required details below to instantly publish a craft to the live Supabase database.
              </p>

              <form onSubmit={handleAddProduct} className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Craft Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Royal Ghotki Hand-Stitched Topi"
                    className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all cursor-pointer"
                    >
                      {SINDHI_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price (PKR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-sm font-bold text-gray-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="3500"
                        className="w-full text-sm pl-12 pr-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Quantity & Artisan Shop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="10"
                      className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Artisan Shop (Optional)
                    </label>
                    <select
                      value={selectedArtisanId}
                      onChange={(e) => setSelectedArtisanId(e.target.value)}
                      className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all cursor-pointer"
                    >
                      <option value="">Sindh Hunar Direct Crafts</option>
                      {artisans.map((artisan) => (
                        <option key={artisan.id} value={artisan.id}>
                          {artisan.shop_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL with Fast Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Product Image URL *
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setNewImage(
                            'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/ajrak.jpg'
                          )
                        }
                        className="text-[10px] text-[#800000] hover:underline"
                      >
                        Sample Ajrak
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewImage(
                            'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_topi.jpg'
                          )
                        }
                        className="text-[10px] text-[#800000] hover:underline"
                      >
                        Sample Topi
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewImage(
                            'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_quilt.jpg'
                          )
                        }
                        className="text-[10px] text-[#800000] hover:underline"
                      >
                        Sample Ralli
                      </button>
                    </div>
                  </div>

                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://... or click quick samples above"
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-mono"
                  />

                  {/* Image Live Preview */}
                  {newImage && (
                    <div className="mt-3 relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-sm">
                      <Image
                        src={newImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Description & Artisan Story
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Details about craftsmanship, materials used, natural dyes, region of origin..."
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="flex-1 py-4 px-6 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border border-[#C5A059]"
                  >
                    {isSubmittingProduct ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving to Supabase Database...
                      </span>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                        <span>Publish Craft to Live Bazaar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="py-4 px-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCTS CATALOG (LIVE FROM DATABASE)              */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                  Crafts & Catalog Management
                </h2>
                <p className="text-xs text-gray-500">
                  Showing real products loaded directly from Supabase &apos;products&apos; table.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('add')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                <span>+ Add New Craft</span>
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <span className="w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs">Fetching real-time crafts from Supabase...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-[#C5A059]/40 p-8 flex flex-col items-center justify-center">
                <Package className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-xl font-bold font-bebas text-gray-700">Database Table is Empty</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  There are currently no products in the database. Add your first Sindhi craft now!
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="mt-5 px-6 py-2.5 rounded-full bg-[#800000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#660000]"
                >
                  Add Craft Now
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3.5 px-4">Craft</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                                    No Img
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-xs">{product.name}</h4>
                                <span className="text-[10px] text-gray-400 block line-clamp-1 max-w-xs">
                                  {product.description || 'No description provided'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#800000]/10 text-[#800000]">
                              {product.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-[#800000] text-sm">
                            Rs. {product.price?.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-mono text-gray-600">
                            {product.stock_quantity ?? 10} units
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleAvailability(product)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                                product.is_available !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.is_available !== false ? (
                                <>
                                  <Eye className="w-3 h-3" /> Available
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" /> Sold Out
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Craft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: USER ROLES MANAGEMENT (MATCHING MOBILE APP 1:1)   */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                  User Profiles & Role Governance
                </h2>
                <p className="text-xs text-gray-500">
                  Manage roles (Customer, Artisan, Admin) directly in Supabase &apos;profiles&apos; table.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none shadow-2xs"
                />
              </div>
            </div>

            {loadingProfiles ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <span className="w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs">Loading profiles from Supabase...</span>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold font-bebas text-gray-700">No Users Found</h3>
                <p className="text-xs text-gray-400 mt-1">Try modifying your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-[#C5A059]/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#800000] to-[#C5A059] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {p.name ? p.name.slice(0, 2).toUpperCase() : 'SH'}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 leading-tight">
                              {p.name || 'Anonymous User'}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              {p.email || 'No email attached'}
                            </span>
                          </div>
                        </div>

                        {/* Current Role Badge */}
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            p.role === 'admin'
                              ? 'bg-[#002366] text-white'
                              : p.role === 'artisan'
                              ? 'bg-[#800000] text-white'
                              : 'bg-[#C5A059]/20 text-[#800000] border border-[#C5A059]/40'
                          }`}
                        >
                          {p.role || 'customer'}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-500 mb-4">
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="font-semibold text-gray-700">{p.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="text-gray-400">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Active Member'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Change Role Controls */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Set Role:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUserRoleChange(p, 'customer')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            p.role === 'customer'
                              ? 'bg-[#C5A059] text-gray-900 shadow-2xs font-extrabold'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          Customer
                        </button>

                        <button
                          onClick={() => handleUserRoleChange(p, 'artisan')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            p.role === 'artisan'
                              ? 'bg-[#800000] text-white shadow-2xs font-extrabold'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          Artisan
                        </button>

                        <button
                          onClick={() => handleUserRoleChange(p, 'admin')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            p.role === 'admin'
                              ? 'bg-[#002366] text-white shadow-2xs font-extrabold'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ORDERS MANAGEMENT (LIVE FROM SUPABASE)             */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                  Customer Orders & Fulfillments
                </h2>
                <p className="text-xs text-gray-500">
                  Track orders placed through web cart or mobile application in &apos;orders&apos; table.
                </p>
              </div>

              <button
                onClick={loadAdminOrders}
                className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider self-start sm:self-auto cursor-pointer"
              >
                Refresh Orders
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <span className="w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs">Loading orders from Supabase...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-xl font-bold font-bebas text-gray-700">No Orders in Database</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  When customers purchase crafts from the web Bazaar or mobile app, orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-[#C5A059]/60 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono uppercase block">Order ID</span>
                        <h4 className="text-sm font-bold font-mono text-[#800000]">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}
                        </span>

                        {/* Status Selector Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order, e.target.value as Order['status'])
                          }
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : order.status === 'confirmed'
                              ? 'bg-[#002366]/10 text-[#002366] border-[#002366]/30'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✓ Confirmed</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">★ Delivered</option>
                          <option value="cancelled">✕ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Customer Delivery Info
                        </span>
                        <p className="font-bold text-gray-900">
                          {order.shipping_address?.name || order.profiles?.name || 'Customer'}
                        </p>
                        <p className="text-gray-600 font-mono">
                          Phone: {order.phone || order.shipping_address?.phone || 'Not given'}
                        </p>
                        <p className="text-gray-500 mt-0.5">
                          {order.shipping_address?.address}, {order.shipping_address?.city}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Special Instructions
                        </span>
                        <p className="text-gray-600 italic">
                          {order.notes || order.shipping_address?.notes || 'No special instructions given.'}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="pt-3 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(order.items) &&
                          order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
                            >
                              {item.quantity}x {item.name} (Rs. {item.price})
                            </span>
                          ))}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Amount</span>
                        <span className="text-lg font-bold font-bebas text-[#800000]">
                          Rs. {order.total_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ARTISANS DIRECTORY (LIVE FROM SUPABASE)            */}
        {/* ========================================================= */}
        {activeTab === 'artisans' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold font-bebas text-[#1A1A1A] leading-tight">
                  Artisans & Heritage Workshops
                </h2>
                <p className="text-xs text-gray-500">
                  Registered craftsmen from Mehran region stored in &apos;artisans&apos; table.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 rounded-full bg-[#800000] text-white text-xs font-bold uppercase tracking-wider self-start sm:self-auto cursor-pointer"
              >
                + Upgrade User to Artisan
              </button>
            </div>

            {loadingArtisans ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <span className="w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs">Loading artisans from Supabase...</span>
              </div>
            ) : artisans.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center justify-center">
                <Store className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-xl font-bold font-bebas text-gray-700">No Artisans Registered Yet</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  Go to &quot;User Roles&quot; tab and set a user&apos;s role to &quot;Artisan&quot; to register their workshop!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {artisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-[#C5A059]/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#800000] text-[#C5A059] flex items-center justify-center">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 leading-tight">
                              {artisan.shop_name}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              ID: {artisan.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            artisan.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {artisan.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                          Craft Specialties
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(artisan.specialty) ? (
                            artisan.specialty.map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[#800000]/10 text-[#800000] text-[10px] font-medium"
                              >
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-600">Traditional Sindhi Crafts</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Rating</span>
                      <span className="font-bold text-[#C5A059]">★ {artisan.rating || 5.0} / 5.0</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* ARTISAN UPGRADE MODAL (MATCHING MOBILE ADMIN DASHBOARD)  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {artisanModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setArtisanModalUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#800000] z-10 overflow-hidden"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center mx-auto mb-2">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-bebas text-[#1A1A1A]">
                  Register Artisan Workshop
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Assigning artisan credentials for:{' '}
                  <span className="font-bold text-gray-800">
                    {artisanModalUser.name || artisanModalUser.email}
                  </span>
                </p>
              </div>

              <form onSubmit={handleArtisanModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Shop / Workshop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={artisanShopName}
                    onChange={(e) => setArtisanShopName(e.target.value)}
                    placeholder="e.g. Ustad Ismail Ajrak House"
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Specialties (comma separated)
                  </label>
                  <input
                    type="text"
                    value={artisanSpecialty}
                    onChange={(e) => setArtisanSpecialty(e.target.value)}
                    placeholder="Ajrak Printing, Sindhi Topi, Rilli Work"
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Confirm Artisan Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtisanModalUser(null)}
                    className="py-3 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
