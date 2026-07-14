import API from './api';

const carService = {
  getAllCars: async () => {
    const response = await API.get('/api/cars');
    return response.data;
  },
  getCarById: async (id) => {
    const response = await API.get(`/api/cars/${id}`);
    return response.data;
  },
  addCar: async (carDto) => {
    const response = await API.post('/api/cars', carDto);
    return response.data;
  },
  updateCar: async (id, carDto) => {
    const response = await API.put(`/api/cars/${id}`, carDto);
    return response.data;
  },
  deleteCar: async (id) => {
    const response = await API.delete(`/api/cars/${id}`);
    return response.data;
  }
};

export default carService;
