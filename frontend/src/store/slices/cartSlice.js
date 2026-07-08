import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cart.service.js';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to fetch cart.');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity = 1 }, { rejectWithValue }) => {
    try {
      if (product.stock <= 0) {
        throw new Error('Product is out of stock.');
      }
      const response = await cartService.addItem(product.id, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || error.message || 'Failed to add item to cart.');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(id, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to update item quantity.');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cartService.removeItem(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to remove item from cart.');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to clear cart.');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // We can define mock reducer if needed, but extraReducers will handle all updates
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Clear Cart state on auth logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.items = [];
        state.status = 'idle';
        state.error = null;
      });
  },
});

export default cartSlice.reducer;
