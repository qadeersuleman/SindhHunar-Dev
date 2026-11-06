// Utility Helper Functions

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+92|0)?[3]\d{9}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const calculateTax = (amount: number, taxRate = 0.17): number => {
  return amount * taxRate;
};

export const calculateTotal = (
  subtotal: number,
  taxRate = 0.17,
  shipping = 0
): number => {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax + shipping;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getRandomColor = (): string => {
  const colors = [
    '#C41E3A', '#1B5E20', '#FF6B35', '#1976D2',
    '#7B1FA2', '#F57C00', '#388E3C', '#D32F2F',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

import { Linking, Alert } from 'react-native';

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to download this file type');
    }
  } catch (error) {
    console.error('Failed to download file:', error);
    Alert.alert('Error', 'Failed to download file');
  }
};

import { Platform } from 'react-native';

export const isMobile = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

export const isTablet = (): boolean => {
  return Platform.OS === 'ios' && Platform.isPad;
};

export const isDesktop = (): boolean => {
  return Platform.OS === 'web' || Platform.OS === 'windows' || Platform.OS === 'macos';
};
