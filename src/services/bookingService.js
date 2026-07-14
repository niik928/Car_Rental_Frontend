import API from './api';

const bookingService = {
  getAllBookings: async () => {
    const response = await API.get('/api/bookings');
    return response.data;
  },
  createBooking: async (userId, vehicleId, bookingDto) => {
    const response = await API.post(`/api/bookings/user/${userId}/vehicle/${vehicleId}`, bookingDto);
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await API.put(`/api/bookings/${id}/cancel`);
    return response.data;
  },
  getBookingsByUser: async (userId) => {
    const response = await API.get(`/api/bookings/user/${userId}`);
    return response.data;
  },
  getBookingById: async (id) => {
    const response = await API.get(`/api/bookings/${id}`);
    return response.data;
  }
};

export default bookingService;
