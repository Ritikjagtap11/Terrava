import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { format } from 'date-fns';
import { ShoppingBagIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
      CONFIRMED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
      SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
      DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800',
      CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-16 text-center">
            <ShoppingBagIcon className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</p>
            <p className="text-gray-500 dark:text-gray-400">When you buy products, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 overflow-hidden relative"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Placed on {format(new Date(), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Items Purchased</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {item.productName} <span className="text-gray-500 dark:text-gray-400 ml-2">x {item.quantity}</span>
                        </span>
                        <span className="font-extrabold text-gray-900 dark:text-white">
                          &#8377;{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-900/50 -mx-8 -mb-8 p-8 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-100 dark:border-gray-700">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Amount Paid</p>
                    <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                      &#8377;{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  {order.transactionHash && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-3 w-full md:w-auto">
                      <CubeTransparentIcon className="h-8 w-8 text-primary-500 dark:text-primary-400 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Blockchain Hash</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate w-48 sm:w-64">
                          {order.transactionHash}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;