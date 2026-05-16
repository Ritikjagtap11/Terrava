import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';
import { CheckCircleIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'CREDIT_CARD'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      };

      await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();
  const shipping = 10;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10 space-y-10"
            >
              {/* Shipping Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Shipping Address *
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200"
                    placeholder="Enter your full shipping address"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'CREDIT_CARD' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT_CARD"
                      checked={formData.paymentMethod === 'CREDIT_CARD'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <CreditCardIcon className={`h-8 w-8 mb-3 ${formData.paymentMethod === 'CREDIT_CARD' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-bold ${formData.paymentMethod === 'CREDIT_CARD' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Credit Card</span>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'CRYPTO' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CRYPTO"
                      checked={formData.paymentMethod === 'CRYPTO'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`h-8 w-8 mb-3 flex items-center justify-center font-bold text-xl ${formData.paymentMethod === 'CRYPTO' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>₿</div>
                    <span className={`font-bold ${formData.paymentMethod === 'CRYPTO' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Crypto</span>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'CASH_ON_DELIVERY' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <BanknotesIcon className={`h-8 w-8 mb-3 ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-bold text-center ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? 'Placing Order...' : 'Place Order Securely'}
              </button>
            </motion.form>
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
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      &#8377;{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">&#8377;{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Shipping</span>
                  <span className="text-gray-900 dark:text-white">&#8377;{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300 font-medium">
                  <span>Tax (8%)</span>
                  <span className="text-gray-900 dark:text-white">&#8377;{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="flex justify-between text-2xl font-extrabold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-primary-600 dark:text-primary-400">&#8377;{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;