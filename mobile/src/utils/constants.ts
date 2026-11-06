// App Constants for Sindh Hunar

export const APP_NAME = 'Sindh Hunar';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  AUTH: '/auth',
  UPLOAD: '/upload',
};

// Screen Names
export const SCREEN_NAMES = {
  HOME: 'Home',
  PRODUCTS: 'Products',
  PRODUCT_DETAIL: 'ProductDetail',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  PROFILE: 'Profile',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  SELLER_DASHBOARD: 'SellerDashboard',
  ADD_PRODUCT: 'AddProduct',
  EDIT_PRODUCT: 'EditProduct',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
};

// Categories
export const CATEGORIES = [
  'Textiles',
  'Pottery',
  'Jewelry',
  'Woodwork',
  'Metalwork',
  'Paintings',
  'Leather Goods',
  'Embroidery',
  'Other',
];

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  BANK_TRANSFER: 'bank_transfer',
  WHATSAPP_ORDER: 'whatsapp_order',
};

// Delivery Options
export const DELIVERY_OPTIONS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  PICKUP: 'pickup',
};

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 1000,
  PHONE_NUMBER_PATTERN: /^(\+92|0)?[3]\d{9}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Image Upload
export const IMAGE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_PRODUCT: 5,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  APP_SETTINGS: 'app_settings',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  WEAK_PASSWORD: 'Password is too weak.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  REQUIRED_FIELD: 'This field is required.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};
