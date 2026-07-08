import api from './api.js';

export const productService = {
  async getAllProducts() {
    const response = await api.get('/products', {
      params: {
        limit: 1000, // Fetch a large number of products so client-side UI filters still work
      },
    });

    const products = response.docs || [];
    return products.map((product) => ({
      ...product,
      id: product._id,
      imageUrl: product.image || product.imageUrl,
    }));
  },

  async getProductById(id) {
    const product = await api.get(`/products/${id}`);
    return {
      ...product,
      id: product._id,
      imageUrl: product.image || product.imageUrl,
    };
  },
};
