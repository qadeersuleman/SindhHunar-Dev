'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { SweetAlertToastProvider } from '@/components/ui/SweetAlertToast';
import { AuthModal } from '@/components/AuthModal';
import { CustomerOrdersModal } from '@/components/CustomerOrdersModal';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductModal } from '@/components/ProductModal';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SweetAlertToastProvider>
      <AuthProvider>
        <AppProvider>
          {children}
          {/* Global Modals accessible anywhere */}
          <AuthModal />
          <CustomerOrdersModal />
          <CartDrawer />
          <ProductModal />
        </AppProvider>
      </AuthProvider>
    </SweetAlertToastProvider>
  );
};
