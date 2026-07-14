import API from './api';

const paymentService = {
  createPayment: async (bookingId, paymentDto) => {
    const response = await API.post(`/api/payments/booking/${bookingId}`, paymentDto);
    return response.data;
  },
  getAllPayments: async () => {
    const response = await API.get('/api/payments');
    return response.data;
  },
  getPaymentById: async (id) => {
    const response = await API.get(`/api/payments/${id}`);
    return response.data;
  },
  updatePaymentStatus: async (id, status) => {
    const response = await API.put(`/api/payments/${id}/status`, { status });
    return response.data;
  },
  deletePayment: async (id) => {
    const response = await API.delete(`/api/payments/${id}`);
    return response.data;
  }
};

export default paymentService;
