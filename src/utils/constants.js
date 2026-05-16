export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID || '5777';

export const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Meat',
  'Other'
];

export const UNITS = ['kg', 'lbs', 'pieces', 'dozen', 'liters'];

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  CRYPTO: 'Cryptocurrency',
  CASH_ON_DELIVERY: 'Cash on Delivery'
}; 