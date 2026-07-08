import api from './api.js';

const mapCartResponse = (backendCart) => {
  if (!backendCart || !backendCart.products) {
    return [];
  }
  
  return backendCart.products.map((item) => {
    const product = item.productId || {};
    return {
      id: product._id || product.id || String(product),
      name: product.name || 'Unknown Product',
      brand: product.brand || '',
      price: product.price || item.price || 0,
      stock: product.stock !== undefined ? product.stock : 99,
      imageUrl: product.image || product.imageUrl || '',
      category: product.category || '',
      quantity: item.quantity,
    };
  });
};

export const cartService = {
  async getCart() {
    const cart = await api.get('/cart');
    return mapCartResponse(cart);
  },

  async addItem(productId, quantity = 1) {
    const cart = await api.post('/cart', { productId, quantity });
    return mapCartResponse(cart);
  },

  async updateQuantity(productId, quantity) {
    const cart = await api.patch(`/cart/${productId}`, { quantity });
    return mapCartResponse(cart);
  },

  async removeItem(productId) {
    const cart = await api.delete(`/cart/${productId}`);
    return mapCartResponse(cart);
  },

  async clearCart() {
    await api.delete('/cart');
    return [];
  },
};
