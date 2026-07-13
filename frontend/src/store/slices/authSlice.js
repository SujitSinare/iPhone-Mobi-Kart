import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service.js';

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

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

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.errorMessage || 'Failed to fetch profile.');
    }
  }
);

// Initialize auth state synchronously from storage JWT payload
const token = localStorage.getItem('imk_token') || '';
let initialUser = null;
let initialRole = null;
let initialIsAuthenticated = false;

if (token) {
  const decoded = decodeJwt(token);
  if (decoded && decoded.exp * 1000 > Date.now()) {
    initialUser = { id: decoded.sub, email: decoded.email };
    initialRole = decoded.role === 'ADMIN' ? 'admin' : 'customer';
    initialIsAuthenticated = true;
  } else {
    localStorage.removeItem('imk_token');
  }
}

const initialState = {
  currentUser: initialUser,
  role: initialRole,
  isAuthenticated: initialIsAuthenticated,
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
    dateOfBirth: user.dateOfBirth || '',
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
      })

      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.currentUser = mapUserFromBackend(action.payload);
        state.isAuthenticated = true;
        state.role = action.payload.role === 'ADMIN' ? 'admin' : 'customer';
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.currentUser = null;
        state.role = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
