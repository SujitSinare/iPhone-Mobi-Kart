import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage.js';

const initialState = {
  items: loadFromStorage(STORAGE_KEYS.cart, []),
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      saveToStorage(STORAGE_KEYS.cart, state.items);
    },
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      if (product.stock <= 0) {
        return;
      }

      const existingItem = state.items.find((item) => item.id === product.id);
      const requestedQuantity = Number(quantity);

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + requestedQuantity, product.stock);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: Math.min(requestedQuantity, product.stock),
        });
      }

      saveToStorage(STORAGE_KEYS.cart, state.items);
    },
    updateCartQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id);

      if (!item) {
        return;
      }

      const stock = Number(action.payload.stock ?? item.stock);
      item.stock = stock;
      item.quantity = stock <= 0 ? 0 : Math.min(Math.max(1, Number(action.payload.quantity)), stock);
      saveToStorage(STORAGE_KEYS.cart, state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToStorage(STORAGE_KEYS.cart, state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveToStorage(STORAGE_KEYS.cart, state.items);
    },
  },
});

export const { setCartItems, addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
