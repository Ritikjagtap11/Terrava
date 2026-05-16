import api from './api';

// ✅ helper to fix image URL
const fixImageUrl = (product) => {
  if (product && product.imageUrl) {
    if (product.imageUrl.startsWith('uploads/')) {
      return {
        ...product,
        imageUrl: `http://localhost:8080/${product.imageUrl}`
      };
    }
  }
  return product;
};

const fixList = (list) => list.map(fixImageUrl);

export const productService = {

  getAllProducts: async () => {
    const data = (await api.get('/products')).data;
    return fixList(data);
  },

  getAvailableProducts: async () => {
    const data = (await api.get('/products/public/available')).data;
    return fixList(data);
  },

  getProductById: async (id) => {
    const data = (await api.get(`/products/${id}`)).data;
    return fixImageUrl(data);
  },

  getFarmerProducts: async () => {
    const data = (await api.get('/products/farmer')).data;
    return fixList(data);
  },

  getProductsByCategory: async (category) => {
    const data = (await api.get(`/products/category/${category}`)).data;
    return fixList(data);
  },

  createProduct: async (data) => (
    await api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  ).data,

  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => (
    await api.delete(`/products/${id}`)
  ).data
};