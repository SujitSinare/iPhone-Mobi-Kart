import axios from 'axios';

let authToken = '';

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract Nested Data & Handle Unauthorized Errors
api.interceptors.response.use(
  (response) => {
    // NestJS TransformInterceptor wraps successful results in { success: true, data: ... }
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const responseData = error.response ? error.response.data : null;
    
    // Extract standard error message
    let errorMessage = 'An unexpected error occurred.';
    if (responseData) {
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.errors && responseData.errors.length > 0) {
        errorMessage = responseData.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Attach custom error message to error object
    error.errorMessage = errorMessage;

    // Handle 401 Unauthorized redirect
    if (status === 401) {
      setAuthToken('');
      // If we are currently not on a login page, redirect the user
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        const redirectPath = currentPath.startsWith('/admin') ? '/admin/login' : '/login';
        window.location.href = redirectPath;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
