import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  CubeTransparentIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { productService } from "../../services/productService";
import toast from "react-hot-toast";
import ConfirmModal from "../common/ConfirmModal";

const ProductList = ({ products, onRefresh }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete);
      toast.success("Product deleted successfully");
      onRefresh();
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        <CubeTransparentIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-xl font-medium mb-6">No products found in your catalog</p>
        <Link to="/farmer/add-product">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-md hover:shadow-lg flex items-center justify-center mx-auto space-x-2">
            <PlusIcon className="h-5 w-5 stroke-2" />
            <span>Add Your First Product</span>
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col group card-hover"
          >
            {/* Product Image */}
            <div className="h-52 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
              {product.imageUrl ? (
                <img
                  loading="lazy"
                  src={
                    product.imageUrl.startsWith("uploads/")
                      ? `http://localhost:8080/${product.imageUrl}`
                      : product.imageUrl
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-product.png";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 font-medium text-sm">
                  No Image
                </div>
              )}
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-full shadow-sm">
                  {product.category}
                </span>
                {product.certification && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-yellow-400/90 backdrop-blur-sm text-yellow-900 px-3 py-1.5 rounded-full shadow-sm">
                    {product.certification}
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                {product.description}
              </p>

              <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-baseline">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    &#8377;{product.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1 font-medium">
                    / {product.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">Stock</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.quantity}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 mb-4">
                <Link
                  to={`/farmer/edit-product/${product.id}`}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2 stroke-2" />
                  Edit
                </Link>
                <button
                  onClick={() => openDeleteModal(product.id)}
                  disabled={isDeleting && productToDelete === product.id}
                  className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2.5 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center disabled:opacity-50"
                >
                  {isDeleting && productToDelete === product.id ? (
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <TrashIcon className="h-4 w-4 mr-2 stroke-2" />
                  )}
                  {isDeleting && productToDelete === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              {product.blockchainHash && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center">
                  <CubeTransparentIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                    {product.blockchainHash}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
        isProcessing={isDeleting}
      />
    </>
  );
};

export default ProductList;
