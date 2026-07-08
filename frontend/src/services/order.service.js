import api from './api.js';

const mapOrderResponse = (order, currentUser) => {
  let shippingAddress = {
    addressLine1: order.shippingAddress || '',
  };

  try {
    // If we serialized the address as JSON, parse it back
    if (order.shippingAddress && (order.shippingAddress.startsWith('{') || order.shippingAddress.startsWith('['))) {
      shippingAddress = JSON.parse(order.shippingAddress);
    }
  } catch (e) {
    shippingAddress = {
      addressLine1: order.shippingAddress || '',
    };
  }

  // Populate customer details from the populated userId if available, or fall back to currentUser
  const user = order.userId || {};
  const customer = {
    name: user.name || currentUser?.name || 'Customer',
    mobileNumber: user.mobile || currentUser?.mobileNumber || currentUser?.mobile || '',
    email: user.email || currentUser?.email || '',
  };

  // Map order items
  const items = (order.items || []).map((item, index) => {
    const product = item.productId || {};
    return {
      id: product._id || product.id || String(product) || `item-${index}`,
      name: item.name || product.name || 'iPhone Model',
      brand: product.brand || 'Apple',
      price: item.price || product.price || 0,
      quantity: item.quantity,
      imageUrl: product.image || product.imageUrl || '',
    };
  });

  return {
    id: order.orderNumber || order._id,
    status: order.orderStatus || 'Pending',
    createdAt: order.createdAt,
    total: order.totalAmount || 0,
    customer,
    shippingAddress,
    items,
  };
};

export const orderService = {
  async createOrder(shippingAddressObj) {
    // Serialize structured address object to string
    const shippingAddress = JSON.stringify(shippingAddressObj);
    const response = await api.post('/orders', { shippingAddress });
    return mapOrderResponse(response);
  },

  async getOrders(currentUser) {
    const response = await api.get('/orders');
    const orders = Array.isArray(response) ? response : [];
    return orders.map((order) => mapOrderResponse(order, currentUser));
  },

  async getOrderDetails(id, currentUser) {
    const response = await api.get(`/orders/${id}`);
    return mapOrderResponse(response, currentUser);
  },

  async cancelOrder(id) {
    return api.delete(`/orders/${id}`);
  },
};
