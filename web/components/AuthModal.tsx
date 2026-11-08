'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useToast, useSweetAlert } from '@/components/ui/SweetAlertToast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Palette, ShoppingBag, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useApp();
  const { signIn, signUp, user, profile, role, signOut, setDevRole } = useAuth();
  const toast = useToast();
  const sweetAlert = useSweetAlert();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || 'Invalid credentials');
        } else {
          toast.success('Welcome back to Sindh Hunar!', 'Khush Amdeed');
          setIsAuthModalOpen(false);
        }
      } else {
        const { error } = await signUp(email, password, name, selectedRole);
        if (error) {
          toast.error(error.message || 'Sign up failed');
        } else {
          toast.success('Account created successfully! Check your email if verification is required.', 'Success');
          setIsAuthModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleQuickSwitch = async (targetRole: UserRole) => {
    await setDevRole(targetRole);
    toast.success(`Role switched to ${targetRole.toUpperCase()}`, 'Role Updated');
    sweetAlert.success(
      `Role Active: ${targetRole.toUpperCase()}`,
      `You are now viewing Sindh Hunar as a ${targetRole}. You can access the role features right away.`
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 z-10 overflow-hidden"
        >
          {/* Ajrak Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800000] via-[#C5A059] to-[#002366]" />

          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800000]/10 text-[#800000] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sindh Hunar Gateway</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-[#1A1A1A] tracking-tight">
              {user ? 'My Profile & Roles' : mode === 'signin' ? 'Sign In to Your Account' : 'Create an Account'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {user
                ? `Logged in as: ${profile?.email || user.email}`
                : 'Experience authentic Indus heritage and artisan commerce'}
            </p>
          </div>

          {/* IF ALREADY LOGGED IN: SHOW ROLE STATUS & QUICK SWITCHER */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#C5A059]/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Full Name</span>
                  <span className="text-xs font-bold text-gray-800">{profile?.name || 'Sindhi Hunar Member'}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Current Role</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      role === 'admin'
                        ? 'bg-[#002366] text-white'
                        : role === 'artisan'
                        ? 'bg-[#800000] text-white'
                        : 'bg-[#C5A059] text-gray-900'
                    }`}
                  >
                    {role}
                  </span>
                </div>
              </div>

              {/* Instant Role Previewer */}
              <div className="p-3.5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30">
                <h4 className="text-[11px] font-bold text-[#800000] uppercase tracking-wider mb-2">
                  Role Preview & Switcher (Live)
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRoleQuickSwitch('admin')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      role === 'admin'
                        ? 'bg-[#002366] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </button>

                  <button
                    onClick={() => handleRoleQuickSwitch('artisan')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      role === 'artisan'
                        ? 'bg-[#800000] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>Artisan</span>
                  </button>

                  <button
                    onClick={() => handleRoleQuickSwitch('customer')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      role === 'customer'
                        ? 'bg-[#C5A059] text-gray-900 shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Customer</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {role === 'admin' && (
                  <a
                    href="/admin"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-full bg-[#002366] hover:bg-[#001744] text-white text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all"
                  >
                    Enter Admin Panel
                  </a>
                )}
                <button
                  onClick={async () => {
                    const confirmed = await sweetAlert.confirm(
                      'Log Out?',
                      'Are you sure you want to sign out of Sindh Hunar?'
                    );
                    if (confirmed) {
                      await signOut();
                      setIsAuthModalOpen(false);
                      toast.info('Signed out successfully');
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-full bg-white border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            // SIGN IN / SIGN UP FORM
            <>
              {/* Tab Toggle */}
              <div className="flex bg-gray-200/80 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    mode === 'signin' ? 'bg-white text-[#800000] shadow-xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    mode === 'signup' ? 'bg-white text-[#800000] shadow-xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ustad Ismail Mehran"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Join As</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('customer')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedRole === 'customer'
                            ? 'bg-[#800000]/10 border-[#800000] text-[#800000] font-bold'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 mb-1" />
                        <div>Customer / Buyer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('artisan')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedRole === 'artisan'
                            ? 'bg-[#800000]/10 border-[#800000] text-[#800000] font-bold'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Palette className="w-4 h-4 mb-1" />
                        <div>Artisan / Seller</div>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : mode === 'signin' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Fast Demo Testing Notice */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <span className="text-[11px] text-gray-400 block mb-2">Want to test roles immediately?</span>
                <div className="flex justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@sindhhunar.com');
                      setPassword('SindhHunar2026!');
                    }}
                    className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600 font-medium"
                  >
                    Fill Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('artisan@sindhhunar.com');
                      setPassword('SindhHunar2026!');
                    }}
                    className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600 font-medium"
                  >
                    Fill Artisan
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
