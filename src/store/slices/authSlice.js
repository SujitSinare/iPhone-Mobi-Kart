import { createSlice } from '@reduxjs/toolkit';
import { adminConfig } from '../../config/admin.js';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage.js';

const persistedAuth = loadFromStorage(STORAGE_KEYS.auth, {
  currentUser: null,
  role: null,
  isAuthenticated: false,
});

const initialState = {
  users: loadFromStorage(STORAGE_KEYS.users, []),
  currentUser: persistedAuth.currentUser,
  role: persistedAuth.role,
  isAuthenticated: persistedAuth.isAuthenticated,
  status: 'idle',
  error: null,
};

const persistAuth = (state) => {
  saveToStorage(STORAGE_KEYS.auth, {
    currentUser: state.currentUser,
    role: state.role,
    isAuthenticated: state.isAuthenticated,
  });
};

const createUserId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
};

const withoutPassword = (user) => {
  const { password: _password, ...publicUser } = user;
  return publicUser;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerCustomer: (state, action) => {
      const normalizedEmail = action.payload.email.trim().toLowerCase();
      const duplicateUser = state.users.some((user) => user.email === normalizedEmail);

      if (duplicateUser) {
        state.error = 'An account with this email already exists.';
        return;
      }

      const newUser = {
        id: createUserId(),
        firstName: action.payload.firstName.trim(),
        lastName: action.payload.lastName.trim(),
        name: `${action.payload.firstName.trim()} ${action.payload.lastName.trim()}`.trim(),
        mobileNumber: action.payload.mobileNumber.trim(),
        email: normalizedEmail,
        dateOfBirth: action.payload.dateOfBirth,
        password: action.payload.password,
        createdAt: new Date().toISOString(),
      };

      state.users.push(newUser);
      state.currentUser = withoutPassword(newUser);
      state.role = 'customer';
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      saveToStorage(STORAGE_KEYS.users, state.users);
      persistAuth(state);
    },
    loginCustomer: (state, action) => {
      const normalizedEmail = action.payload.email.trim().toLowerCase();
      const user = state.users.find(
        (item) => item.email === normalizedEmail && item.password === action.payload.password,
      );

      if (!user) {
        state.error = 'Invalid email or password.';
        return;
      }

      state.currentUser = withoutPassword(user);
      state.role = 'customer';
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      persistAuth(state);
    },
    loginAdmin: (state, action) => {
      const isValidAdmin =
        action.payload.email.trim().toLowerCase() === adminConfig.email.toLowerCase() &&
        action.payload.password === adminConfig.password;

      if (!isValidAdmin) {
        state.error = 'Invalid admin credentials.';
        return;
      }

      state.currentUser = {
        id: 'admin',
        name: adminConfig.name,
        email: adminConfig.email,
      };
      state.role = 'admin';
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      persistAuth(state);
    },
    logout: (state) => {
      state.currentUser = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      persistAuth(state);
    },
    updateCustomerProfile: (state, action) => {
      if (!state.currentUser || state.role !== 'customer') {
        return;
      }

      const userIndex = state.users.findIndex((user) => user.id === state.currentUser.id);

      if (userIndex === -1) {
        return;
      }

      const updatedUser = {
        ...state.users[userIndex],
        firstName: action.payload.firstName.trim(),
        lastName: action.payload.lastName.trim(),
        name: `${action.payload.firstName.trim()} ${action.payload.lastName.trim()}`.trim(),
        mobileNumber: action.payload.mobileNumber.trim(),
        email: action.payload.email.trim().toLowerCase(),
        dateOfBirth: action.payload.dateOfBirth,
      };

      const duplicateEmail = state.users.some(
        (user) => user.id !== updatedUser.id && user.email === updatedUser.email,
      );

      if (duplicateEmail) {
        state.error = 'Another account already uses this email.';
        return;
      }

      if (action.payload.password) {
        updatedUser.password = action.payload.password;
      }

      state.users[userIndex] = updatedUser;
      state.currentUser = withoutPassword(updatedUser);
      state.error = null;
      saveToStorage(STORAGE_KEYS.users, state.users);
      persistAuth(state);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  logout,
  updateCustomerProfile,
  clearAuthError,
} = authSlice.actions;
export default authSlice.reducer;
