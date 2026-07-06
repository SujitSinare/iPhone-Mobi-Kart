import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { seedProducts } from '../../data/seedProducts.js';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage.js';

const loadProducts = () => {
  const storedProducts = loadFromStorage(STORAGE_KEYS.products, []);

  if (storedProducts.length === 0) {
    return seedProducts;
  }

  const seedProductMap = new Map(seedProducts.map((product) => [product.id, product]));
  const migratedStoredProducts = storedProducts.map((product) => {
    const seedProduct = seedProductMap.get(product.id);

    if (seedProduct && product.imageUrl?.includes('images.unsplash.com')) {
      return { ...product, imageUrl: seedProduct.imageUrl };
    }

    return product;
  });
  const storedProductIds = new Set(storedProducts.map((product) => product.id));
  const missingSeedProducts = []; //seedProducts.filter((product) => !storedProductIds.has(product.id));
  const products = [...migratedStoredProducts, ...missingSeedProducts];

  if (missingSeedProducts.length > 0 || migratedStoredProducts.some((product, index) => product !== storedProducts[index])) {
    saveToStorage(STORAGE_KEYS.products, products);
  }

  return products;
};

const initialState = {
  items: loadProducts(),
  status: 'idle',
  error: null,
};

const createProductId = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `product-${Date.now()}`;

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      saveToStorage(STORAGE_KEYS.products, state.items);
    },
    addProduct: (state, action) => {
      const baseId = createProductId(action.payload.name);
      const idExists = state.items.some((product) => product.id === baseId);
      const product = {
        ...action.payload,
        id: action.payload.id || (idExists ? `${baseId}-${Date.now()}` : baseId),
        price: Number(action.payload.price),
        stock: Number(action.payload.stock),
      };

      state.items.push(product);
      saveToStorage(STORAGE_KEYS.products, state.items);
    },
    updateProduct: (state, action) => {
      const productIndex = state.items.findIndex((product) => product.id === action.payload.id);

      if (productIndex === -1) {
        return;
      }

      state.items[productIndex] = {
        ...state.items[productIndex],
        ...action.payload,
        price: Number(action.payload.price),
        stock: Number(action.payload.stock),
      };
      saveToStorage(STORAGE_KEYS.products, state.items);
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((product) => product.id !== action.payload);
      saveToStorage(STORAGE_KEYS.products, state.items);
    },
    updateStock: (state, action) => {
      const product = state.items.find((item) => item.id === action.payload.id);

      if (!product) {
        return;
      }

      product.stock = Math.max(0, Number(action.payload.stock));
      saveToStorage(STORAGE_KEYS.products, state.items);
    },
    reduceStockForOrder: (state, action) => {
      action.payload.forEach((orderItem) => {
        const product = state.items.find((item) => item.id === orderItem.id);

        if (product) {
          product.stock = Math.max(0, product.stock - Number(orderItem.quantity));
        }
      });

      saveToStorage(STORAGE_KEYS.products, state.items);
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  reduceStockForOrder,
} = productSlice.actions;
export default productSlice.reducer;
