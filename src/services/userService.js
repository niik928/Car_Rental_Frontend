import API from './api';

const userService = {
  getProfile: async () => {
    const response = await API.get('/api/users/profile');
    return response.data;
  },
  getUserByEmail: async (email) => {
    const response = await API.get(`/api/users/email/${email}`);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await API.get(`/api/users/${id}`);
    return response.data;
  },
  updateUser: async (id, userDto) => {
    const response = await API.put(`/api/users/${id}`, userDto);
    return response.data;
  },
  updateUserStatus: async (id, status) => {
    const response = await API.put(`/api/users/status/${id}`, { status });
    return response.data;
  },
  addDrivingLicense: async (id, licenseDto) => {
    const response = await API.post(`/api/users/${id}/driving-license`, licenseDto);
    return response.data;
  },
  getUserDrivingLicense: async (id) => {
    const response = await API.get(`/api/users/driving-license/${id}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await API.get('/api/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/api/users/${id}`);
    return response.data;
  },
  getDashboardData: async () => {
    const response = await API.get('/api/dashboard');
    return response.data;
  }
};

export default userService;
