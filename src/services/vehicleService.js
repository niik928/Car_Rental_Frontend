import API from './api';

const vehicleService = {
  getAllVehicles: async () => {
    const response = await API.get('/api/vehicles');
    return response.data;
  },
  getVehicleById: async (id) => {
    const response = await API.get(`/api/vehicles/${id}`);
    return response.data;
  },
  addVehicle: async (variantId, vehicleDto) => {
    const response = await API.post(`/api/vehicles/${variantId}`, vehicleDto);
    return response.data;
  },
  updateVehicle: async (id, vehicleDto) => {
    const response = await API.put(`/api/vehicles/${id}`, vehicleDto);
    return response.data;
  },
  deleteVehicle: async (id) => {
    const response = await API.delete(`/api/vehicles/${id}`);
    return response.data;
  }
};

export default vehicleService;
