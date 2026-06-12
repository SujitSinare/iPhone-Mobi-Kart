import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage.js';

const initialState = {
  items: loadFromStorage(STORAGE_KEYS.orders, []),
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
      saveToStorage(STORAGE_KEYS.orders, state.items);
    },
    addOrder: (state, action) => {
      const order = {
        id: `order-${Date.now()}`,
        status: 'Placed',
        createdAt: new Date().toISOString(),
        ...action.payload,
      };

      state.items.unshift(order);
      saveToStorage(STORAGE_KEYS.orders, state.items);
    },
  },
});

export const { setOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
