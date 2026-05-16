import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { PlusIcon, CubeIcon, ChartBarIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import ProductList from './ProductList';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    verifiedProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getFarmerProducts();
      setProducts(data);
      
      // Calculate stats
      const verified = data.filter(p => p.isVerified).length;
      const revenue = data.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      setStats({
        totalProducts: data.length,
        verifiedProducts: verified,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 card-hover relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 w-2 h-full ${colorClass}`}></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-lg">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-20 text-').replace('500', '600')} dark:bg-opacity-10`}>
           <Icon className={`h-10 w-10 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Farmer Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your products and track market performance</p>
          </div>
          <Link to="/farmer/add-product">
            <button
              className="bg-primary-600 text-white px-8 py-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full md:w-auto"
            >
              <PlusIcon className="h-6 w-6 stroke-2" />
              <span>Add New Product</span>
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={CubeIcon}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Verified Products"
            value={stats.verifiedProducts}
            icon={ChartBarIcon}
            colorClass="bg-green-500"
          />
          <StatCard
            title="Estimated Value"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            icon={CurrencyRupeeIcon}
            colorClass="bg-yellow-500"
          />
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Products Catalog</h2>
          <ProductList products={products} onRefresh={fetchProducts} />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;