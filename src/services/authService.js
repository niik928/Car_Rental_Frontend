import API from './api';

const authService = {
  login: async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data && response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.userDto));
    }
    return response.data;
  },

  register: async (fullName, email, phone, password) => {
    const response = await API.post('/api/auth/register', {
      fullName,
      email,
      phone,
      password,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await API.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout api error', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
