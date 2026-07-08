import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/order.service.js';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const currentUser = auth.currentUser;
      const response = await orderService.getOrders(currentUser);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to fetch orders.');
    }
  }
);

export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (orderPayload, { rejectWithValue }) => {
    try {
      // Extract shippingAddress object from payload and place order
      const response = await orderService.createOrder(orderPayload.shippingAddress);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to place order.');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Order
      .addCase(addOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Clear Orders state on auth logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.items = [];
        state.status = 'idle';
        state.error = null;
      });
  },
});

export default orderSlice.reducer;
