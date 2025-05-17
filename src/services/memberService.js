import axios from 'axios';

const API_URL = 'http://localhost:8081/api/members';

const memberService = {
  // CRUD Operations
  getAllMembers: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Get all members error:', error);
      throw error;
    }
  },

  getMemberById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get member error:', error);
      throw error;
    }
  },

  createMember: async (memberData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, memberData);
      return response.data;
    } catch (error) {
      console.error('Create member error:', error);
      throw error;
    }
  },

  updateMember: async (id, memberData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, memberData);
      return response.data;
    } catch (error) {
      console.error('Update member error:', error);
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`);
      return true;
    } catch (error) {
      console.error('Delete member error:', error);
      throw error;
    }
  },

  // Custom Operations
  getAllMembersByType: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/filter/getall/${type}`);
      return response.data;
    } catch (error) {
      console.error('Get members by type error:', error);
      throw error;
    }
  },

  viewImage: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/viewImage`);
      return response.data;
    } catch (error) {
      console.error('View image error:', error);
      throw error;
    }
  }
};

export default memberService;