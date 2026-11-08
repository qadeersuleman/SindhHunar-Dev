'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

// ==========================================
// Types
// ==========================================
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

export interface AlertOptions {
  title: string;
  text?: string;
  icon?: 'success' | 'warning' | 'error' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}

interface SweetAlertToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
  };
  sweetAlert: {
    fire: (options: AlertOptions) => Promise<{ isConfirmed: boolean }>;
    confirm: (title: string, text?: string, options?: Partial<AlertOptions>) => Promise<boolean>;
    success: (title: string, text?: string) => Promise<boolean>;
    error: (title: string, text?: string) => Promise<boolean>;
  };
}

const SweetAlertToastContext = createContext<SweetAlertToastContextType | undefined>(undefined);

// ==========================================
// Provider Component
// ==========================================
export const SweetAlertToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // SweetAlert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [alertResolver, setAlertResolver] = useState<((val: { isConfirmed: boolean }) => void) | null>(null);

  // Toast dispatchers
  const addToast = useCallback((message: string, type: ToastType, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // SweetAlert fire
  const fireAlert = useCallback((options: AlertOptions): Promise<{ isConfirmed: boolean }> => {
    return new Promise((resolve) => {
      setAlertConfig(options);
      setAlertResolver(() => resolve);
      setAlertOpen(true);
    });
  }, []);

  const handleAlertClose = useCallback((isConfirmed: boolean) => {
    setAlertOpen(false);
    if (alertResolver) {
      alertResolver({ isConfirmed });
      setAlertResolver(null);
    }
  }, [alertResolver]);

  const confirmAlert = useCallback(async (title: string, text?: string, options?: Partial<AlertOptions>) => {
    const result = await fireAlert({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: options?.confirmButtonText || 'Yes, Proceed',
      cancelButtonText: options?.cancelButtonText || 'Cancel',
      ...options,
    });
    return result.isConfirmed;
  }, [fireAlert]);

  const successAlert = useCallback(async (title: string, text?: string) => {
    const result = await fireAlert({
      title,
      text,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Shukriya / OK',
    });
    return result.isConfirmed;
  }, [fireAlert]);

  const errorAlert = useCallback(async (title: string, text?: string) => {
    const result = await fireAlert({
      title,
      text,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Theek Hai / OK',
    });
    return result.isConfirmed;
  }, [fireAlert]);

  const contextValue: SweetAlertToastContextType = {
    toast: {
      success: (msg, title) => addToast(msg, 'success', title),
      error: (msg, title) => addToast(msg, 'error', title),
      info: (msg, title) => addToast(msg, 'info', title),
      warning: (msg, title) => addToast(msg, 'warning', title),
    },
    sweetAlert: {
      fire: fireAlert,
      confirm: confirmAlert,
      success: successAlert,
      error: errorAlert,
    },
  };

  return (
    <SweetAlertToastContext.Provider value={contextValue}>
      {children}

      {/* ================= TOAST CONTAINER ================= */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto rounded-2xl shadow-xl border p-4 flex items-start gap-3 backdrop-blur-md transition-all ${
                item.type === 'success'
                  ? 'bg-white/95 border-[#C5A059] text-gray-900 shadow-[#C5A059]/10'
                  : item.type === 'error'
                  ? 'bg-white/95 border-red-500 text-gray-900 shadow-red-500/10'
                  : item.type === 'warning'
                  ? 'bg-white/95 border-amber-500 text-gray-900 shadow-amber-500/10'
                  : 'bg-white/95 border-[#002366] text-gray-900 shadow-[#002366]/10'
              }`}
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {item.type === 'success' && (
                  <div className="w-8 h-8 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#800000]" />
                  </div>
                )}
                {item.type === 'error' && (
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'warning' && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'info' && (
                  <div className="w-8 h-8 rounded-full bg-[#002366]/10 text-[#002366] flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="flex-1 pr-1">
                {item.title && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#800000] mb-0.5">
                    {item.title}
                  </h4>
                )}
                <p className="text-xs text-gray-700 leading-snug font-medium">
                  {item.message}
                </p>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => removeToast(item.id)}
                className="shrink-0 text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ================= SWEETALERT MODAL DIALOG ================= */}
      <AnimatePresence>
        {alertOpen && alertConfig && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleAlertClose(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-2 border-[#C5A059]/40 z-10 overflow-hidden"
            >
              {/* Traditional Ajrak Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800000] via-[#C5A059] to-[#002366]" />

              {/* Icon Visual */}
              <div className="mx-auto mb-5 flex items-center justify-center">
                {alertConfig.icon === 'success' && (
                  <div className="w-20 h-20 rounded-full bg-emerald-100/80 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-600 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-pulse" />
                  </div>
                )}
                {alertConfig.icon === 'warning' && (
                  <div className="w-20 h-20 rounded-full bg-amber-100/80 border-2 border-amber-500/40 flex items-center justify-center text-amber-600 shadow-inner">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                )}
                {alertConfig.icon === 'error' && (
                  <div className="w-20 h-20 rounded-full bg-red-100/80 border-2 border-red-500/40 flex items-center justify-center text-red-600 shadow-inner">
                    <XCircle className="w-10 h-10" />
                  </div>
                )}
                {alertConfig.icon === 'question' && (
                  <div className="w-20 h-20 rounded-full bg-[#800000]/10 border-2 border-[#800000]/30 flex items-center justify-center text-[#800000] shadow-inner">
                    <HelpCircle className="w-10 h-10 text-[#800000]" />
                  </div>
                )}
                {(!alertConfig.icon || alertConfig.icon === 'info') && (
                  <div className="w-20 h-20 rounded-full bg-[#002366]/10 border-2 border-[#002366]/30 flex items-center justify-center text-[#002366] shadow-inner">
                    <Sparkles className="w-10 h-10 text-[#C5A059]" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold font-bebas text-[#1A1A1A] tracking-tight leading-tight">
                {alertConfig.title}
              </h3>

              {/* Text Description */}
              {alertConfig.text && (
                <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {alertConfig.text}
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-7 flex items-center justify-center gap-3">
                {alertConfig.showCancelButton && (
                  <button
                    type="button"
                    onClick={() => handleAlertClose(false)}
                    className="flex-1 py-3 px-5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    {alertConfig.cancelButtonText || 'Cancel'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleAlertClose(true)}
                  className={`flex-1 py-3 px-6 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer ${
                    alertConfig.confirmButtonColor ||
                    (alertConfig.icon === 'error' || alertConfig.icon === 'warning'
                      ? 'bg-[#800000] hover:bg-[#660000]'
                      : 'bg-[#800000] hover:bg-[#660000] border border-[#C5A059]')
                  }`}
                >
                  {alertConfig.confirmButtonText || 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SweetAlertToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(SweetAlertToastContext);
  if (!context) {
    throw new Error('useToast must be used within a SweetAlertToastProvider');
  }
  return context.toast;
};

export const useSweetAlert = () => {
  const context = useContext(SweetAlertToastContext);
  if (!context) {
    throw new Error('useSweetAlert must be used within a SweetAlertToastProvider');
  }
  return context.sweetAlert;
};
