// Price formatting utilities for Sindh Hunar

export const formatPrice = (price: number, currency = 'USD'): string => {
  if (isNaN(price)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPricePKR = (price: number): string => {
  if (isNaN(price)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const parsePrice = (priceString: string): number => {
  const cleanPrice = priceString.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanPrice);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): { amount: number; percentage: number } => {
  if (originalPrice <= 0) {
    return { amount: 0, percentage: 0 };
  }

  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    amount: Math.max(0, discountAmount),
    percentage: Math.max(0, discountPercentage),
  };
};

export const calculateTax = (
  amount: number,
  taxRate = 0.17 // 17% tax rate for Pakistan
): number => {
  return amount * taxRate;
};

export const calculateShipping = (
  weight: number,
  distance: number,
  baseRate = 100
): number => {
  // Simple shipping calculation based on weight and distance
  const weightCharge = weight * 10; // ₹10 per kg
  const distanceCharge = distance * 2; // ₹2 per km
  return baseRate + weightCharge + distanceCharge;
};

export const calculateTotal = (
  subtotal: number,
  taxRate = 0.17,
  shipping = 0
): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} => {
  const tax = calculateTax(subtotal, taxRate);
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};

export const formatPriceRange = (
  minPrice: number,
  maxPrice: number,
  currency = 'USD'
): string => {
  const formattedMin = formatPrice(minPrice, currency);
  const formattedMax = formatPrice(maxPrice, currency);
  
  if (minPrice === maxPrice) {
    return formattedMin;
  }
  
  return `${formattedMin} - ${formattedMax}`;
};

export const getPriceRange = (prices: number[]): {
  min: number;
  max: number;
  average: number;
} => {
  if (prices.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }

  const sortedPrices = [...prices].sort((a, b) => a - b);
  const min = sortedPrices[0];
  const max = sortedPrices[sortedPrices.length - 1];
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  return {
    min,
    max,
    average: Math.round(average * 100) / 100,
  };
};

export const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const formatCompactPrice = (price: number, currency = 'USD'): string => {
  if (price >= 1000000) {
    return `${currency} ${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${currency} ${(price / 1000).toFixed(1)}K`;
  } else {
    return formatPrice(price, currency);
  }
};
