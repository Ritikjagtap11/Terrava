import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 sm:p-16"
          >
            <ShoppingBagIcon className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              Start adding some fresh, blockchain-verified products from our farmers!
            </p>
            <Link to="/products">
              <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Browse Marketplace
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center sm:space-x-8"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0 mb-6 sm:mb-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 font-medium text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 w-full text-center sm:text-left mb-6 sm:mb-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">{item.category}</p>
                  <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                    &#8377;{item.price} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ {item.unit}</span>
                  </p>
                </div>

                {/* Controls & Subtotal */}
                <div className="flex flex-col items-center sm:items-end space-y-4 w-full sm:w-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-center sm:text-right">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      &#8377;{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold px-6 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sticky top-28"
            >
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">&#8377;{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Shipping</span>
                  <span className="text-gray-900 dark:text-white">&#8377;10.00</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Tax (8%)</span>
                  <span className="text-gray-900 dark:text-white">&#8377;{(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="flex justify-between text-2xl font-extrabold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-primary-600 dark:text-primary-400">&#8377;{(getTotalPrice() + 10 + getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link to="/products">
                <button className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;