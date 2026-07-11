import axiosInstance from '../api/axiosInstance';

export const vehicleService = {
  getAll: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    const response = await axiosInstance.get('/vehicles', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  search: async (params) => {
    const response = await axiosInstance.get('/vehicles/search', { params });
    return response.data;
  },

  add: async (payload) => {
    const response = await axiosInstance.post('/vehicles', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await axiosInstance.put(`/vehicles/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },

  purchase: async (id, quantity = 1) => {
    const response = await axiosInstance.post(`/vehicles/${id}/purchase`, { quantity });
    return response.data;
  },

  restock: async (id, quantity = 1) => {
    const response = await axiosInstance.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  }
};
export default vehicleService;
