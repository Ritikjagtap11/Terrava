import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import { PlusIcon, MinusIcon, CloudArrowUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    growingMethod: '',
    harvestDate: '',
    certification: '',
    chemicals: [],
    nutrients: []
  });

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Other'];
  const units = ['kg', 'lbs', 'pieces', 'dozen', 'liters'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Chemicals handlers
  const addChemical = () => setFormData({
    ...formData,
    chemicals: [...formData.chemicals, { chemicalName: '', quantity: '', unit: 'mg', isHarmful: false, safetyLevel: 'SAFE' }]
  });
  const removeChemical = (index) => setFormData({ ...formData, chemicals: formData.chemicals.filter((_, i) => i !== index) });
  const updateChemical = (index, field, value) => {
    const updated = [...formData.chemicals];
    updated[index][field] = value;
    setFormData({ ...formData, chemicals: updated });
  };

  // Nutrients handlers
  const addNutrient = () => setFormData({
    ...formData,
    nutrients: [...formData.nutrients, { nutrientName: '', value: '', unit: 'g', dailyValuePercentage: '' }]
  });
  const removeNutrient = (index) => setFormData({ ...formData, nutrients: formData.nutrients.filter((_, i) => i !== index) });
  const updateNutrient = (index, field, value) => {
    const updated = [...formData.nutrients];
    updated[index][field] = value;
    setFormData({ ...formData, nutrients: updated });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
       toast.error("Please select a product image");
       return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("product", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      data.append("image", imageFile);

      await productService.createProduct(data);
      toast.success("Product added successfully!");
      navigate("/farmer/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200 font-medium";
  const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Add New Product</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Provide details about your fresh produce to list on the marketplace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Image Upload Section */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Image</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Image Preview */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden h-64 border border-gray-200 dark:border-gray-700 flex items-center justify-center relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <CloudArrowUpIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <span className="font-medium">No image selected</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>
                    Upload Image *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="space-y-1 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <label className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none px-2">
                          <span>Upload a file</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} required className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="e.g., Organic Tomatoes" />
                </div>
                <div>
                  <label className={labelClasses}>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputClasses}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Price (per unit) *</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">&#8377;</span>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" className={`${inputClasses} pl-10`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Quantity *</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className={`${inputClasses} flex-1 min-w-0`} placeholder="e.g., 100" />
                    <select name="unit" value={formData.unit} onChange={handleChange} className={`${inputClasses} sm:w-32 min-w-0`}>
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClasses} placeholder="Describe the quality, freshness, and details..." />
                </div>
                <div>
                  <label className={labelClasses}>Harvest Date</label>
                  <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Certification</label>
                  <input type="text" name="certification" value={formData.certification} onChange={handleChange} placeholder="e.g., Organic, Non-GMO" className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Growing Method</label>
                  <textarea name="growingMethod" value={formData.growingMethod} onChange={handleChange} rows={3} className={inputClasses} placeholder="Describe your growing method (e.g., Hydroponic, Traditional soil, Greenhouse)" />
                </div>
              </div>
            </div>

            {/* Chemicals Section */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Chemicals Used</h2>
                <button type="button" onClick={addChemical} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold px-5 py-2.5 rounded-xl flex items-center hover:bg-primary-100 dark:hover:bg-primary-900/40 transition">
                  <PlusIcon className="h-5 w-5 mr-2 stroke-2" /> Add Chemical
                </button>
              </div>
              {formData.chemicals.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center border border-dashed border-gray-200 dark:border-gray-700">No chemicals added.</p>
              )}
              {formData.chemicals.map((c, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl mb-4 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={c.chemicalName} placeholder="Chemical Name" onChange={e => updateChemical(i, 'chemicalName', e.target.value)} className={inputClasses} />
                    <input type="number" value={c.quantity} placeholder="Quantity" onChange={e => updateChemical(i, 'quantity', e.target.value)} className={inputClasses} />
                    <select value={c.safetyLevel} onChange={e => updateChemical(i, 'safetyLevel', e.target.value)} className={inputClasses}>
                      <option value="SAFE">Safe</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="HARMFUL">Harmful</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-bold cursor-pointer">
                      <input type="checkbox" checked={c.isHarmful} onChange={e => updateChemical(i, 'isHarmful', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 bg-white dark:bg-gray-800" /> 
                      <span>Mark as harmful</span>
                    </label>
                    <button type="button" onClick={() => removeChemical(i)} className="text-red-600 dark:text-red-400 font-bold flex items-center hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                      <MinusIcon className="h-4 w-4 mr-1 stroke-2" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrients Section */}
            <div className="pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Nutritional Info</h2>
                <button type="button" onClick={addNutrient} className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold px-5 py-2.5 rounded-xl flex items-center hover:bg-primary-100 dark:hover:bg-primary-900/40 transition">
                  <PlusIcon className="h-5 w-5 mr-2 stroke-2" /> Add Nutrient
                </button>
              </div>
              {formData.nutrients.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center border border-dashed border-gray-200 dark:border-gray-700">No nutritional info added.</p>
              )}
              {formData.nutrients.map((n, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl mb-4 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <input type="text" value={n.nutrientName} placeholder="Nutrient Name" onChange={e => updateNutrient(i, 'nutrientName', e.target.value)} className={inputClasses} />
                    <input type="number" value={n.value} placeholder="Value" onChange={e => updateNutrient(i, 'value', e.target.value)} className={inputClasses} />
                    <input type="text" value={n.unit} placeholder="Unit (e.g., g, mg)" onChange={e => updateNutrient(i, 'unit', e.target.value)} className={inputClasses} />
                    <input type="number" value={n.dailyValuePercentage} placeholder="% Daily Value" onChange={e => updateNutrient(i, 'dailyValuePercentage', e.target.value)} className={inputClasses} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => removeNutrient(i)} className="text-red-600 dark:text-red-400 font-bold flex items-center hover:text-red-800 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                      <MinusIcon className="h-4 w-4 mr-1 stroke-2" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 pt-6">
              <button type="button" onClick={() => navigate('/farmer/dashboard')} className="mt-4 sm:mt-0 px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
                {loading ? 'Adding Product...' : 'List Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
