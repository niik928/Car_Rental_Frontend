import API from './api';

const variantService = {
  getAllVariants: async () => {
    const response = await API.get('/api/variants');
    return response.data;
  },
  getVariantsByCar: async (carId) => {
    const response = await API.get(`/api/variants/car/${carId}`);
    return response.data;
  },
  getVariantById: async (id) => {
    const response = await API.get(`/api/variants/${id}`);
    return response.data;
  },
  addVariant: async (carId, variantDto) => {
    const response = await API.post(`/api/variants/${carId}`, variantDto);
    return response.data;
  },
  updateVariant: async (id, variantDto) => {
    const response = await API.put(`/api/variants/${id}`, variantDto);
    return response.data;
  },
  deleteVariant: async (id) => {
    const response = await API.delete(`/api/variants/${id}`);
    return response.data;
  }
};

export default variantService;
