import api from './api.js';

const mapProductToBackend = (productData) => {
  return {
    name: productData.name,
    brand: productData.brand,
    category: productData.category || 'iPhone',
    phoneModel: productData.phoneModel || productData.name, // Mapped to name since form does not collect this
    description: productData.description || '',
    color: productData.color || 'Standard', // Mapped since form does not collect this
    storage: productData.storage || '128GB', // Mapped since form does not collect this
    image: productData.imageUrl, // Mapped from imageUrl
    gallery: productData.gallery || [],
    price: Number(productData.price),
    stock: Number(productData.stock),
    discount: productData.discount !== undefined ? Number(productData.discount) : 0,
    isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true,
  };
};

const mapProductFromBackend = (product) => {
  return {
    ...product,
    id: product._id,
    imageUrl: product.image || product.imageUrl,
  };
};

export const adminService = {
  async createProduct(productData) {
    const payload = mapProductToBackend(productData);
    const response = await api.post('/products', payload);
    return mapProductFromBackend(response);
  },

  async updateProduct(id, productData) {
    const payload = mapProductToBackend(productData);
    const response = await api.patch(`/products/${id}`, payload);
    return mapProductFromBackend(response);
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
    return id;
  },

  async updateStock(id, stock) {
    const response = await api.patch(`/products/${id}`, { stock: Number(stock) });
    return mapProductFromBackend(response);
  },

  async getDashboardStats() {
    const stats = await api.get('/dashboard/admin');
    return stats;
  },
};
