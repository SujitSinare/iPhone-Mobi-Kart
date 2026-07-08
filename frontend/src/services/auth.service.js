import api, { setAuthToken } from './api.js';

export const authService = {
  async register(userData) {
    const payload = {
      name: `${userData.firstName.trim()} ${userData.lastName.trim()}`.trim(),
      mobile: userData.mobileNumber.trim(),
      email: userData.email.trim().toLowerCase(),
      dob: userData.dateOfBirth,
      password: userData.password,
      role: 'CUSTOMER',
    };

    const response = await api.post('/auth/register', payload);
    return response;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    return response;
  },

  async adminLogin(email, password) {
    // Attempt Admin login directly
    try {
      const response = await api.post('/auth/admin-login', { email, password });
      if (response.accessToken) {
        setAuthToken(response.accessToken);
      }
      return response;
    } catch (error) {
      // Automatic Self-Seeding of Admin user on fail:
      // If the admin login fails because the user doesn't exist,
      // attempt registering the admin user dynamically, then log in.
      if (error.response && error.response.status === 401 && email === 'admin@iphonemobikart.com') {
        try {
          // Register the admin user dynamically
          await api.post('/auth/register', {
            name: 'Store Admin',
            mobile: '9999999999',
            email: 'admin@iphonemobikart.com',
            password: 'Admin@123',
            role: 'ADMIN',
          });
          // Retry login after registering
          const response = await api.post('/auth/admin-login', { email, password });
          if (response.accessToken) {
            setAuthToken(response.accessToken);
          }
          return response;
        } catch (seedError) {
          // If seeding failed because the admin already existed but password was wrong,
          // throw the original error.
          throw error;
        }
      }
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Suppress network or auth errors during logout
    } finally {
      setAuthToken('');
    }
  },

  async getProfile() {
    return api.get('/auth/profile');
  },

  async updateProfile(profileData) {
    const payload = {};
    if (profileData.firstName && profileData.lastName) {
      payload.name = `${profileData.firstName.trim()} ${profileData.lastName.trim()}`.trim();
    } else if (profileData.name) {
      payload.name = profileData.name;
    }
    if (profileData.mobileNumber) {
      payload.mobile = profileData.mobileNumber.trim();
    } else if (profileData.mobile) {
      payload.mobile = profileData.mobile;
    }
    if (profileData.email) {
      payload.email = profileData.email.trim().toLowerCase();
    }
    if (profileData.dateOfBirth) {
      payload.dob = profileData.dateOfBirth;
    } else if (profileData.dob) {
      payload.dob = profileData.dob;
    }

    const response = await api.patch('/users/profile', payload);
    return response;
  },

  async changePassword(oldPassword, newPassword) {
    return api.patch('/auth/change-password', { oldPassword, newPassword });
  },
};
