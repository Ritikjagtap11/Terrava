import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCartIcon, 
  CheckBadgeIcon,
  ShieldCheckIcon,
  BeakerIcon,
  ScaleIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Product not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm font-medium">
          <Link to="/products" className="text-primary-600 dark:text-primary-400 hover:underline">Products</Link>
          <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[500px] relative"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 text-xl font-medium">
                No Image Available
              </div>
            )}
            {product.isVerified && (
              <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-green-600 dark:text-green-400 px-4 py-2 rounded-full font-bold flex items-center shadow-lg">
                <CheckBadgeIcon className="h-6 w-6 mr-2" />
                Blockchain Verified
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  {product.category}
                </span>
                {product.certification && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-500">
                      {product.certification}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                &#8377;{product.price}
              </span>
              <span className="text-xl text-gray-500 dark:text-gray-400">/ {product.unit}</span>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <UserIcon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400 shrink-0" />
                <div>
                  <strong className="block text-gray-900 dark:text-white">Farmer</strong>
                  <span>{product.farmerName || 'Anonymous'}</span>
                </div>
              </div>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <ScaleIcon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400 shrink-0" />
                <div>
                  <strong className="block text-gray-900 dark:text-white">Available Stock</strong>
                  <span>{product.quantity} {product.unit}</span>
                </div>
              </div>
              {product.harvestDate && (
                <div className="flex items-start text-gray-700 dark:text-gray-300">
                  <CalendarIcon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400 shrink-0" />
                  <div>
                    <strong className="block text-gray-900 dark:text-white">Harvest Date</strong>
                    <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {product.blockchainHash && (
              <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                <ShieldCheckIcon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400 mt-1 shrink-0" />
                <div className="overflow-hidden">
                  <strong className="block text-gray-900 dark:text-white">Blockchain Hash</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all font-mono mt-1">{product.blockchainHash}</p>
                </div>
              </div>
            )}

            {/* Growing Method */}
            {product.growingMethod && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-5 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Growing Method</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.growingMethod}</p>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-6 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 font-bold text-xl shadow-sm"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-16 text-center text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 font-bold text-xl shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chemicals Section */}
        {product.chemicals && product.chemicals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10"
          >
            <div className="flex items-center mb-8">
              <BeakerIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chemicals Used</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.chemicals.map((chemical, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 ${
                    chemical.safetyLevel === 'SAFE'
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : chemical.safetyLevel === 'MODERATE'
                      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                    {chemical.chemicalName}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Quantity: {chemical.quantity} {chemical.unit}
                  </p>
                  <div className="mt-4 flex items-center space-x-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                        chemical.safetyLevel === 'SAFE'
                          ? 'bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300'
                          : chemical.safetyLevel === 'MODERATE'
                          ? 'bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {chemical.safetyLevel}
                    </span>
                    {chemical.isHarmful && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg">
                        Harmful
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Nutrients Section */}
        {product.nutrients && product.nutrients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Nutritional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.nutrients.map((nutrient, index) => (
                <div
                  key={index}
                  className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    {nutrient.nutrientName}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {nutrient.value} {nutrient.unit}
                  </p>
                  {nutrient.dailyValuePercentage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      {nutrient.dailyValuePercentage}% Daily Value
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;