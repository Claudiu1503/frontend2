import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  setUserType: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/setType`, userData);
      return response.data;
    } catch (error) {
      console.error('Set user type error:', error);
      throw error;
    }
  }
};

export default authService;