import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service.js';

export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (userData, { rejectWithValue }) => {
    try {
      await authService.register(userData);
      // Automatically log in customer after registration
      const loginResponse = await authService.login(userData.email, userData.password);
      return loginResponse;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Registration failed.');
    }
  }
);

export const loginCustomer = createAsyncThunk(
  'auth/loginCustomer',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Invalid email or password.');
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Invalid admin credentials.');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Logout failed.');
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'auth/updateCustomerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Profile update failed.');
    }
  }
);

const initialState = {
  currentUser: null,
  role: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

const mapUserFromBackend = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user._id || user.id,
    name: user.name || '',
    email: user.email || '',
    mobileNumber: user.mobile || user.mobileNumber || '',
    dateOfBirth: user.dob || user.dateOfBirth || '',
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Customer
      .addCase(registerCustomer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = mapUserFromBackend(action.payload.user);
        state.role = 'customer';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Login Customer
      .addCase(loginCustomer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = mapUserFromBackend(action.payload.user);
        state.role = 'customer';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = mapUserFromBackend(action.payload.user);
        state.role = 'admin';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.role = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })

      // Update Customer Profile
      .addCase(updateCustomerProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = mapUserFromBackend(action.payload);
        state.error = null;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
