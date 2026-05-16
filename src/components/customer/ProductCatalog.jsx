import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const { addToCart } = useCart();

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, showVerifiedOnly, products]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAvailableProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(p => p.isVerified);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading Marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Fresh Products from Our Farmers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Blockchain-verified quality products delivered securely to your doorstep
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200 appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Verified Only */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <label className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="h-5 w-5 text-primary-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                />
                <div className="flex items-center ml-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Verified Only</span>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-8 px-2">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span> of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-16 text-center shadow-sm">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</p>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col group card-hover"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="relative h-60 overflow-hidden block bg-gray-100 dark:bg-gray-900">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                      No Image
                    </div>
                  )}
                  {product.isVerified && (
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm">
                      <CheckBadgeIcon className="h-4 w-4 mr-1.5" />
                      Verified
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-bold tracking-wider uppercase text-primary-600 dark:text-primary-400">
                      {product.category}
                    </span>
                    {product.certification && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs font-bold tracking-wider uppercase text-yellow-600 dark:text-yellow-500">
                          {product.certification}
                        </span>
                      </>
                    )}
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="mb-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-baseline mb-1">
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        &#8377;{product.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                        / {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>By: <span className="font-medium text-gray-700 dark:text-gray-300">{product.farmerName || 'Anonymous'}</span></span>
                      <span>Stock: <span className="font-medium text-gray-700 dark:text-gray-300">{product.quantity}</span></span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 py-3 rounded-xl font-bold hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;