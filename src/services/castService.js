import axios from 'axios';

const API_URL = 'http://localhost:8082/api/casts';

const castService = {
  // CRUD Operations
  getAllCasts: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Get all casts error:', error);
      throw error;
    }
  },

  getCastById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get cast error:', error);
      throw error;
    }
  },

  createCast: async (castData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, castData);
      return response.data;
    } catch (error) {
      console.error('Create cast error:', error);
      throw error;
    }
  },

  updateCast: async (id, castData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, castData);
      return response.data;
    } catch (error) {
      console.error('Update cast error:', error);
      throw error;
    }
  },

  deleteCast: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`);
      return true;
    } catch (error) {
      console.error('Delete cast error:', error);
      throw error;
    }
  },

  // Filter Operations
  getCastsByFilmId: async (filmId) => {
    try {
      const response = await axios.get(`${API_URL}/film/${filmId}`);
      return response.data;
    } catch (error) {
      console.error('Get casts by film ID error:', error);
      throw error;
    }
  },

  getCastsByActorId: async (actorId) => {
    try {
      const response = await axios.get(`${API_URL}/actor/${actorId}`);
      return response.data;
    } catch (error) {
      console.error('Get casts by actor ID error:', error);
      throw error;
    }
  },

  getCastsByRole: async (role) => {
    try {
      const response = await axios.get(`${API_URL}/role/${role}`);
      return response.data;
    } catch (error) {
      console.error('Get casts by role error:', error);
      throw error;
    }
  }
};

export default castService;