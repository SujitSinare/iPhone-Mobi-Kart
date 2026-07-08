import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/product.service.js';
import { adminService } from '../../services/admin.service.js';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to fetch products.');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminService.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to add product.');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminService.updateProduct(productData.id, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to update product.');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to delete product.');
    }
  }
);

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, stock }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateStock(id, stock);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to update stock.');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reduceStockForOrder: (state, action) => {
      // Optimistic client-side reduction, backend handles actual order stock deduction
      action.payload.forEach((orderItem) => {
        const product = state.items.find((item) => item.id === orderItem.id);
        if (product) {
          product.stock = Math.max(0, product.stock - Number(orderItem.quantity));
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index > -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Stock
      .addCase(updateStock.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index > -1) {
          state.items[index].stock = action.payload.stock;
        }
        state.error = null;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { reduceStockForOrder } = productSlice.actions;
export default productSlice.reducer;
