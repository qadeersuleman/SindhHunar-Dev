// Environment Configuration for Sindh Hunar
import { 
  EXPO_PUBLIC_SUPABASE_URL, 
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_MOCK_API,
  EXPO_PUBLIC_ENABLE_STORYBOOK,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_MAPS_API_KEY,
  GEMINI_API_KEY
} from '@env';

// AI Configuration
export const GEMINI_KEY = GEMINI_API_KEY || '';

// API Configuration
export const API_BASE_URL = EXPO_PUBLIC_API_URL || 'https://api.sindhhunar.com';
export const API_TIMEOUT = 10000;

// Supabase Configuration
export const SUPABASE_URL = EXPO_PUBLIC_SUPABASE_URL || 'https://hypsawmgxqxsgaqfgzfk.supabase.co';
export const SUPABASE_ANON_KEY = EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zcTvi5bpcT51ec9j6LnA6w_5iA5RGIJ';

// Google Auth Configuration
export const GOOGLE_CLIENT_ID = GOOGLE_WEB_CLIENT_ID || '';
export const MAPS_API_KEY = GOOGLE_MAPS_API_KEY || '';

// App Configuration
export const APP_NAME = 'Sindh Hunar';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Celebrating Sindhi Artistry';

// Environment
export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const IS_DEVELOPMENT = ENVIRONMENT === 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';

// Debug Configuration
export const ENABLE_LOGGING = IS_DEVELOPMENT;
export const ENABLE_DEBUG_MODE = IS_DEVELOPMENT;

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: !IS_DEVELOPMENT,
  ENABLE_CRASH_REPORTING: !IS_DEVELOPMENT,
  ENABLE_PUSH_NOTIFICATIONS: IS_PRODUCTION,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTILINGUAL: true,
};

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_CART_ITEMS: 50,
  MAX_FAVORITES: 100,
  MAX_RECENT_SEARCHES: 20,
  CACHE_EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    SELLER_DASHBOARD: '/users/seller/dashboard',
    UPLOAD_IMAGE: '/users/upload-image',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    MULTIPLE_IMAGES: '/upload/images',
  },
};

// Social Media Configuration
export const SOCIAL_CONFIG = {
  WHATSAPP_BUSINESS_NUMBER: '+923001234567',
  FACEBOOK_PAGE: 'https://facebook.com/sindhhunar',
  INSTAGRAM_HANDLE: '@sindhhunar',
  TWITTER_HANDLE: '@sindhhunar',
  YOUTUBE_CHANNEL: 'https://youtube.com/@sindhhunar',
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  DEFAULT_CURRENCY: 'USD',
  SUPPORTED_CURRENCIES: ['USD', 'PKR', 'EUR'],
  TAX_RATE: 0.17, // 17% tax for Pakistan
  SHIPPING_RATES: {
    STANDARD: 150,
    EXPRESS: 300,
    FREE_SHIPPING_THRESHOLD: 1000,
  },
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    latitude: 25.3960, // Hyderabad, Sindh
    longitude: 68.3670,
  },
  DEFAULT_REGION: {
    latitude: 25.3960,
    longitude: 68.3670,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  PAKISTAN_BOUNDS: {
    north: 37.0841,
    south: 23.6939,
    east: 77.8375,
    west: 60.8724,
  },
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'info@sindhhunar.com',
  PHONE: '+92-22-1234567',
  ADDRESS: 'Hyderabad, Sindh, Pakistan',
  WEBSITE: 'https://sindhhunar.com',
};

// Legal Information
export const LEGAL_INFO = {
  PRIVACY_POLICY_URL: 'https://sindhhunar.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://sindhhunar.com/terms',
  REFUND_POLICY_URL: 'https://sindhhunar.com/refunds',
  SHIPPING_POLICY_URL: 'https://sindhhunar.com/shipping',
};

// Development Configuration
export const DEV_CONFIG = {
  MOCK_API: EXPO_PUBLIC_MOCK_API === 'true',
  ENABLE_STORYBOOK: EXPO_PUBLIC_ENABLE_STORYBOOK === 'true',
  DEBUG_NETWORK_REQUESTS: IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: IS_PRODUCTION,
};

// Export all configuration
export const config = {
  API_BASE_URL,
  API_TIMEOUT,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  GOOGLE_CLIENT_ID,
  MAPS_API_KEY,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  ENVIRONMENT,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  ENABLE_LOGGING,
  ENABLE_DEBUG_MODE,
  FEATURES,
  STORAGE_CONFIG,
  ENDPOINTS,
  SOCIAL_CONFIG,
  PAYMENT_CONFIG,
  MAP_CONFIG,
  CONTACT_INFO,
  LEGAL_INFO,
  DEV_CONFIG,
};
