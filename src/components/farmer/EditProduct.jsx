import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    certification: '',
    growingMethod: '',
    imageUrl: ''
  });

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Other'];
  const units = ['kg', 'lbs', 'pieces', 'dozen', 'liters'];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      
      setFormData({
        name: data.name || '',
        description: data.description || '',
        category: data.category || 'Vegetables',
        price: data.price || '',
        quantity: data.quantity || '',
        unit: data.unit || 'kg',
        certification: data.certification || '',
        growingMethod: data.growingMethod || '',
        imageUrl: data.imageUrl || ''
      });

      // Set image preview if exists
      if (data.imageUrl) {
        const imageUrl = data.imageUrl.startsWith('uploads/') 
          ? `http://localhost:8080/${data.imageUrl}`
          : data.imageUrl;
        setImagePreview(imageUrl);
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/farmer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      // Append product data as JSON blob
      data.append(
        "product",
        new Blob([JSON.stringify(formData)], {
          type: "application/json"
        })
      );

      // Append image if selected
      if (imageFile) {
        data.append("image", imageFile);
      }

      await productService.updateProduct(id, data);

      toast.success("Product updated successfully!");
      navigate("/farmer/dashboard");

    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200 font-medium";
  const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 stroke-2" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10"
        >
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Edit Product</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Update the details of your product listing.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Image Upload Section */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Image</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Image Preview */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden h-64 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium">No image preview</span>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>
                    Change Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="space-y-1 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <label className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none px-2">
                          <span>Upload new file</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Leave empty to keep current image</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className={labelClasses}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>
                    Price (per unit) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">&#8377;</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className={`${inputClasses} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Quantity *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="0"
                      className={`${inputClasses} flex-1 min-w-0`}
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`${inputClasses} sm:w-32 min-w-0`}
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Certification
                  </label>
                  <input
                    type="text"
                    name="certification"
                    value={formData.certification}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>
                    Growing Method
                  </label>
                  <textarea
                    name="growingMethod"
                    value={formData.growingMethod}
                    onChange={handleChange}
                    rows={3}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="mt-4 sm:mt-0 px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProduct;