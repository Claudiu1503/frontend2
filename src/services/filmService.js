import axios from 'axios';

const API_URL = 'http://localhost:8083/api/films';

const filmService = {
  // CRUD Operations
  getAllFilms: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Get all films error:', error);
      throw error;
    }
  },

  getFilmById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get film error:', error);
      throw error;
    }
  },

  createFilm: async (filmData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, filmData);
      return response.data;
    } catch (error) {
      console.error('Create film error:', error);
      throw error;
    }
  },

  updateFilm: async (id, filmData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, {
        ...filmData,
        id
      });
      return response.data;
    } catch (error) {
      console.error('Update film error:', error);
      throw error;
    }
  },

  deleteFilm: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`);
      return true;
    } catch (error) {
      console.error('Delete film error:', error);
      throw error;
    }
  },

  // Search and Filter Operations
  searchByTitle: async (title) => {
    try {
      const response = await axios.get(`${API_URL}/search/title/${title}`);
      return response.data;
    } catch (error) {
      console.error('Search by title error:', error);
      throw error;
    }
  },

  searchByYear: async (year) => {
    try {
      const response = await axios.get(`${API_URL}/search/year/${year}`);
      return response.data;
    } catch (error) {
      console.error('Search by year error:', error);
      throw error;
    }
  },

  searchFilms: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Search films error:', error);
      throw error;
    }
  },

  // Export Operations
  exportToCsv: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export to CSV error:', error);
      throw error;
    }
  },

  exportToDocx: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/docx`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export to DOCX error:', error);
      throw error;
    }
  },

  exportToJson: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/json`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export to JSON error:', error);
      throw error;
    }
  },

  exportToXml: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/xml`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export to XML error:', error);
      throw error;
    }
  },

  // Statistics
  getFilmCountByCategory: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/byCategory`);
      return response.data;
    } catch (error) {
      console.error('Get film count by category error:', error);
      throw error;
    }
  },

  getFilmCountPerYear: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/byYear`);
      return response.data;
    } catch (error) {
      console.error('Get film count per year error:', error);
      throw error;
    }
  }
};

export default filmService;